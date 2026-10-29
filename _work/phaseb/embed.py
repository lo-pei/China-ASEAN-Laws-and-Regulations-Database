#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CALR · Phase B 向量化脚本
    SQLite 里的法规/条文  →  bge-m3 向量（int8 量化）  →  backend/data/vectors/

模型：BAAI/bge-m3（多语言，1024 维，中/英/泰/越/印尼/马来都能 embed）
运行时：onnxruntime（CPU 即可，不需要 torch）
    需先下载模型到 _work/models/bge-m3/（见 _work/phaseb/download.py）

用法：
    python _work/phaseb/embed.py --level law          # 只做法规级（18,861 条，快）
    python _work/phaseb/embed.py --level article      # 只做条文级（334,779 条，慢）
    python _work/phaseb/embed.py --level law --limit 500   # 试跑

产出（backend/data/vectors/）：
    law_ids.json        法规 id 顺序（与向量行一一对应）
    law_vecs.i8.npy     法规向量 int8（N × 1024）
    law_scale.npy       每行的反量化 scale（N,）
    article_meta.json   条文元数据（law_id / no / dup_index）
    article_vecs.i8.npy 条文向量 int8
    article_scale.npy
    manifest.json       版本、维度、条数、模型、量化方式
"""
from __future__ import annotations

import argparse
import io
import json
import os
import sqlite3
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
# 依赖引导：优先用 DirectML 版 onnxruntime（走 GPU），否则退回 CPU 版
_DML = os.path.join(ROOT, "_work", "pylibs_dml")
_CPU = os.path.join(ROOT, "_work", "pylibs")
if os.path.isdir(_DML):
    sys.path.insert(0, _DML)
if _CPU not in sys.path:
    sys.path.append(_CPU)

import numpy as np  # noqa: E402

MODEL_DIR = os.environ.get("CALR_MODEL") or os.path.join(ROOT, "_work", "models", "bge-m3")
DB = os.path.join(ROOT, "backend", "data", "calr.db")
OUT = os.path.join(ROOT, "backend", "data", "vectors")

MAX_LEN = int(os.environ.get("CALR_MAX_LEN") or 512)
BATCH = int(os.environ.get("CALR_BATCH") or 16)


def log(msg):
    print(msg, flush=True)


# ---------------------------------------------------------------- 模型
class Embedder:
    def __init__(self, model_dir: str):
        import onnxruntime as ort
        from tokenizers import Tokenizer

        self.tok = Tokenizer.from_file(os.path.join(model_dir, "tokenizer.json"))
        self.tok.enable_truncation(max_length=MAX_LEN)
        self.tok.enable_padding(length=None, pad_id=1, pad_token="<pad>")

        so = ort.SessionOptions()
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        # 8 核机器上 8 线程通常最优
        so.intra_op_num_threads = max(1, min(8, os.cpu_count() or 4))
        so.inter_op_num_threads = 1
        t0 = time.time()
        avail = ort.get_available_providers()
        # 优先 GPU（DirectML），失败再退回 CPU
        providers = []
        if "DmlExecutionProvider" in avail:
            providers = ["DmlExecutionProvider", "CPUExecutionProvider"]
        else:
            providers = ["CPUExecutionProvider"]
        try:
            self.sess = ort.InferenceSession(
                os.path.join(model_dir, "model.onnx"), so, providers=providers)
            if len(providers) > 1 and "Dml" not in str(self.sess.get_providers()):
                raise RuntimeError("DirectML 未生效")
        except Exception as e:
            log("  ! GPU 不可用（%s），回退 CPU" % str(e)[:80])
            self.sess = ort.InferenceSession(
                os.path.join(model_dir, "model.onnx"), so,
                providers=["CPUExecutionProvider"])
        log("  实际 provider: %s" % self.sess.get_providers())
        self.inputs = {i.name for i in self.sess.get_inputs()}
        self.dim = None
        log("  模型加载完成 %.1fs，输入 %s" % (time.time() - t0, sorted(self.inputs)))

    @staticmethod
    def _clean(t):
        """清洗：去掉 NUL 与不可见控制字符；空串换成占位符。"""
        s = str(t or "")
        s = "".join(ch for ch in s if ch == "\n" or ch == "\t" or ord(ch) >= 32)
        s = s.strip()
        return s if s else "(空)"

    def encode(self, texts):
        """返回 (N, 1024) float32，已 L2 归一化。"""
        texts = [self._clean(t) for t in texts]
        encs = self.tok.encode_batch(list(texts))
        ids = np.array([e.ids for e in encs], dtype=np.int64)
        mask = np.array([e.attention_mask for e in encs], dtype=np.int64)
        feed = {"input_ids": ids, "attention_mask": mask}
        if "token_type_ids" in self.inputs:
            feed["token_type_ids"] = np.zeros_like(ids)
        try:
            out = self.sess.run(None, feed)
        except Exception as e:
            # DirectML 在个别输入上会抛底层异常（且异常消息本身可能不是合法 UTF-8）。
            # 二分重试：把批次拆小，定位并隔离问题样本。
            if len(texts) == 1:
                raise
            half = len(texts) // 2
            log("      ! 批次失败（%s），二分重试 %d+%d" % (type(e).__name__, half, len(texts) - half))
            a = self.encode(texts[:half])
            b = self.encode(texts[half:])
            return np.vstack([a, b])
        # bge-m3 输出两种：last_hidden_state 或 已池化的句子向量
        h = out[0]
        if h.ndim == 3:
            # CLS 池化（bge 系列约定）
            vec = h[:, 0, :]
        else:
            vec = h
        # L2 归一化
        n = np.linalg.norm(vec, axis=1, keepdims=True)
        n[n == 0] = 1.0
        return (vec / n).astype(np.float32)


# ---------------------------------------------------------------- 量化
def quantize(mat: np.ndarray):
    """逐行对称 int8 量化：q = round(x/scale)，scale = max(|x|)/127。"""
    scale = np.abs(mat).max(axis=1) / 127.0
    scale[scale == 0] = 1e-8
    q = np.round(mat / scale[:, None]).astype(np.int8)
    return q, scale.astype(np.float32)


# ---------------------------------------------------------------- 数据
def load_laws(limit: int = 0, content: bool = False):
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    sql = ("SELECT id, country, title_zh, title_en, title_orig, summary "
           "FROM laws ORDER BY id")
    rs = con.execute(sql).fetchall()
    ids, texts = [], []
    first_articles = {}
    chapters = {}
    if content:
        # 法规级内容升级：标题(3 语) + 摘要 + 前两条正文 + 章节标题。
        # 只读一次 articles 表，按 law_id 聚合，避免 42,121 次逐法查询。
        for r in con.execute(
                "SELECT law_id, text_zh, text_en, text_orig, chapter "
                "FROM articles ORDER BY law_id, no, IFNULL(dup_index,1)"):
            lid = r["law_id"]
            first_articles.setdefault(lid, [])
            if len(first_articles[lid]) < 2:
                txt = " ".join(x for x in (r["text_zh"], r["text_en"], r["text_orig"]) if x).strip()
                if txt:
                    first_articles[lid].append(txt[:1200])
            if len(chapters.get(lid, [])) < 5 and r["chapter"]:
                try:
                    ch = json.loads(r["chapter"]) if isinstance(r["chapter"], str) else r["chapter"]
                    if isinstance(ch, dict):
                        ch = ch.get("zh") or ch.get("en") or next(iter(ch.values()), "")
                    ch = str(ch).strip()
                except Exception:
                    ch = str(r["chapter"]).strip()
                if ch and ch not in chapters.setdefault(lid, []):
                    chapters.setdefault(lid, []).append(ch)
    con.close()
    if limit:
        rs = rs[:limit]
    for r in rs:
        parts = [r["title_zh"], r["title_en"], r["title_orig"]]
        try:
            sm = json.loads(r["summary"]) if r["summary"] else None
            if isinstance(sm, dict):
                parts.append(sm.get("zh") or "")
        except Exception:
            pass
        if content:
            parts.extend(chapters.get(r["id"]) or [])
            parts.extend(first_articles.get(r["id"]) or [])
        txt = " ".join(p for p in parts if p).strip()
        if not txt:
            txt = r["id"]
        ids.append(r["id"])
        texts.append(txt[:4000])
    return ids, texts


def load_articles(limit: int = 0):
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    rs = con.execute(
        "SELECT law_id, no, dup_index, text_zh, text_en, text_orig "
        "FROM articles ORDER BY law_id, no").fetchall()
    con.close()
    if limit:
        rs = rs[:limit]
    meta, texts = [], []
    for r in rs:
        txt = " ".join(x for x in (r["text_zh"], r["text_en"], r["text_orig"]) if x)
        if not txt.strip():
            txt = "%s 第%s条" % (r["law_id"], r["no"])
        meta.append({"law_id": r["law_id"], "no": r["no"], "dup_index": r["dup_index"]})
        texts.append(txt[:2000])
    return meta, texts


def run(emb: Embedder, label: str, texts, out_vec, out_scale, keep_meta=None, keep_meta_path=None):
    """分批编码 + 断点续跑。

    断点文件 <out_vec>.ckpt  记录已完成条数；对应的中间结果写在 <out_vec>.part.*.npy。
    中断后重跑同一命令即可从断点继续，不必从头再来（334,779 条要跑几小时）。
    """
    n = len(texts)
    dim = None
    part_dir = out_vec + ".parts"
    os.makedirs(part_dir, exist_ok=True)
    ckpt_path = out_vec + ".ckpt"
    start = 0
    if os.path.exists(ckpt_path):
        try:
            start = int(io.open(ckpt_path, encoding="utf-8").read().strip())
        except Exception:
            start = 0
    parts = sorted(f for f in os.listdir(part_dir) if f.endswith(".npy"))
    if start and parts:
        # 校验已有分段数是否与断点匹配
        expect = len(range(0, start, BATCH))
        if len(parts) < expect:
            log("  断点文件说已完成 %d 条，但分段只有 %d 个，从 0 重来" % (start, len(parts)))
            start = 0
            for f in parts:
                os.remove(os.path.join(part_dir, f))
            parts = []
        else:
            log("  ▶ 从断点继续：已完成 %d / %d 条" % (start, n))
    else:
        start = 0

    t0 = time.time()
    done = start
    fails = 0
    for s in range(start, n, BATCH):
        batch = texts[s:s + BATCH]
        try:
            v = emb.encode(batch)
        except Exception as e:
            fails += 1
            log("      !! 批次 %d 最终失败（%s），用零向量占位" % (s, type(e).__name__))
            v = np.zeros((len(batch), dim or 1024), dtype=np.float32)
        if dim is None:
            dim = v.shape[1]
            log("  向量维度 %d" % dim)
        q, sc = quantize(v)
        np.save(os.path.join(part_dir, "p%08d.npy" % s), q)
        np.save(os.path.join(part_dir, "s%08d.npy" % s), sc)
        done = min(n, s + BATCH)
        # 每 50 批落一次断点
        if (s // BATCH) % 50 == 0 or done == n:
            with io.open(ckpt_path, "w", encoding="utf-8") as f:
                f.write(str(done))
        if done % (BATCH * 20) == 0 or done == n:
            el = time.time() - t0
            sp = (done - start) / el if el > 0 else 0
            eta = (n - done) / sp if sp > 0 else 0
            log("    %s %6d/%d  %.1f%%  %.1f 条/秒  已用 %.0fs  剩余 %.0fs%s" % (
                label, done, n, done * 100.0 / n, sp, el, eta,
                ("  失败批次 %d" % fails) if fails else ""))

    # 合并分段
    parts = sorted(f for f in os.listdir(part_dir) if f.startswith("p"))
    qs = [np.load(os.path.join(part_dir, f)) for f in parts]
    parts_s = sorted(f for f in os.listdir(part_dir) if f.startswith("s"))
    scales = [np.load(os.path.join(part_dir, f)) for f in parts_s]
    Q = np.vstack(qs) if qs else np.zeros((0, dim or 1024), dtype=np.int8)
    S = np.concatenate(scales) if scales else np.zeros((0,), dtype=np.float32)
    os.makedirs(OUT, exist_ok=True)
    np.save(out_vec, Q)
    np.save(out_scale, S)
    log("  ✓ %s：%d × %d，int8 占 %.1f MB（fp32 需 %.1f MB）" % (
        label, Q.shape[0], Q.shape[1], Q.nbytes / 1048576, Q.size * 4 / 1048576))
    if fails:
        log("  ⚠ 共 %d 个批次失败（已用零向量占位）" % fails)
    # 成功后清理断点
    try:
        os.remove(ckpt_path)
        for f in os.listdir(part_dir):
            os.remove(os.path.join(part_dir, f))
        os.rmdir(part_dir)
    except Exception:
        pass
    return dim


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", choices=["law", "article", "both"], default="law")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--batch", type=int, default=0)
    ap.add_argument("--law-content", action="store_true",
                    help="法规向量使用标题+摘要+前两条+章节（45 分钟升级；默认仅标题+摘要）")
    args = ap.parse_args()
    global BATCH
    if args.batch:
        BATCH = args.batch

    log("  模型目录: " + MODEL_DIR)
    if not os.path.exists(os.path.join(MODEL_DIR, "model.onnx")):
        log("  ✗ 模型未下载。先运行：python _work/phaseb/download.py")
        sys.exit(1)
    log("  数据库: " + DB)
    log("  输出: " + OUT)
    log("")

    emb = Embedder(MODEL_DIR)
    os.makedirs(OUT, exist_ok=True)
    # manifest 必须「合并」而不是覆盖：法规级和条文级分别在不同次运行中产生，
    # 覆盖会让先跑完的那一级从 manifest 里消失，向量文件还在但读不到。
    man_path = os.path.join(OUT, "manifest.json")
    manifest = {}
    if os.path.exists(man_path):
        try:
            with open(man_path, encoding="utf-8") as _f:
                manifest = json.load(_f) or {}
        except Exception:
            manifest = {}
    manifest.update({"model": "BAAI/bge-m3", "maxLen": MAX_LEN,
                     "quant": "int8-symmetric-per-row",
                     "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
                     "lawContent": "title+summary+first2+chapters" if args.law_content else "title+summary"})

    if args.level in ("law", "both"):
        log("")
        log("  ══ 法规级 ══")
        ids, texts = load_laws(args.limit, content=args.law_content)
        log("  法规 %d 条" % len(ids))
        dim = run(emb, "law", texts, os.path.join(OUT, "law_vecs.i8.npy"),
                  os.path.join(OUT, "law_scale.npy"))
        with open(os.path.join(OUT, "law_ids.json"), "w", encoding="utf-8") as f:
            json.dump(ids, f, ensure_ascii=False)
        manifest["law"] = {"count": len(ids), "dim": dim}

    if args.level in ("article", "both"):
        log("")
        log("  ══ 条文级 ══")
        meta, texts = load_articles(args.limit)
        log("  条文 %d 条" % len(meta))
        dim = run(emb, "article", texts, os.path.join(OUT, "article_vecs.i8.npy"),
                  os.path.join(OUT, "article_scale.npy"))
        with open(os.path.join(OUT, "article_meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False)
        manifest["article"] = {"count": len(meta), "dim": dim}

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    log("")
    log("  ═══ 完成 ═══")
    log("  " + json.dumps(manifest, ensure_ascii=False))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
