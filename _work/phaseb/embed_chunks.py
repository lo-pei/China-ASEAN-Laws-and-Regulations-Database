#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""C 阶段：条文向量 512 token + 单语种 + 窗口切片。

与 A 的差别：
  · 每个条文按原文单语种（orig > zh > en）取文本；
  · 按 512 token、stride 128 切片，单条最多 3 块（首/中/尾）；
  · 输出到独立目录 backend/data/vectors-chunks/，不覆盖 A 的 article_vecs；
  · 检索时按条号聚合 chunk 分数（见 backend/app/chunk_vectors.py）。

用法：
  python _work/phaseb/embed_chunks.py --dry          # 只统计切片数，不加载模型
  python _work/phaseb/embed_chunks.py --batch 4      # 正式编码（约 20h）
"""
from __future__ import annotations

import argparse
import io
import json
import os
import shutil
import sqlite3
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "_work", "pylibs"))

import numpy as np  # noqa: E402
import embed  # noqa: E402
from tokenizers import Tokenizer  # noqa: E402

DB = os.path.join(ROOT, "backend", "data", "calr.db")
OUT = os.environ.get("CALR_CHUNK_VEC") or os.path.join(ROOT, "backend", "data", "vectors-chunks")
TOK = None
MAX_LEN = int(os.environ.get("CALR_MAX_LEN") or 512)
STRIDE = int(os.environ.get("CALR_CHUNK_STRIDE") or 128)
MAX_CHUNKS = int(os.environ.get("CALR_CHUNK_MAX") or 3)


def log(msg):
    print(msg, flush=True)


def tokenizer():
    global TOK
    if TOK is None:
        TOK = Tokenizer.from_file(os.path.join(embed.MODEL_DIR, "tokenizer.json"))
        TOK.no_truncation()
    return TOK


def _json_text(v, lang):
    if not v:
        return ""
    if isinstance(v, str):
        try:
            v = json.loads(v)
        except Exception:
            return v
    if isinstance(v, dict):
        for k in (lang, "zh", "en", "orig"):
            if v.get(k):
                return str(v[k])
        return str(next(iter(v.values()), ""))
    return str(v)


def load_chunks(limit=0):
    """返回 (meta, texts)；每条文最多 MAX_CHUNKS 块。"""
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    rs = con.execute(
        "SELECT law_id,no,dup_index,lang,text_zh,text_en,text_orig,heading,chapter "
        "FROM articles ORDER BY law_id,no,IFNULL(dup_index,1)").fetchall()
    con.close()
    if limit:
        rs = rs[:limit]
    tok = tokenizer()
    meta, texts = [], []
    for r in rs:
        lang = r["lang"] or "orig"
        text = r["text_orig"] or r["text_zh"] or r["text_en"] or ""
        text = " ".join(str(text).split())
        if not text:
            text = "%s 第%s条" % (r["law_id"], r["no"])
        head = _json_text(r["heading"], lang)
        chap = _json_text(r["chapter"], lang)
        prefix = " ".join(x for x in (chap, head) if x).strip()
        payload = (prefix + " " + text).strip() if prefix else text
        ids = tok.encode(payload).ids
        if len(ids) <= MAX_LEN:
            wins = [ids]
        else:
            starts = list(range(0, len(ids), max(1, MAX_LEN - STRIDE)))
            if len(starts) > MAX_CHUNKS:
                picks = [starts[0], starts[len(starts) // 2], starts[-1]]
                starts = sorted(set(picks))
            wins = [ids[s:s + MAX_LEN] for s in starts]
        for ci, w in enumerate(wins):
            txt = tok.decode(w, skip_special_tokens=True).strip()
            if not txt:
                continue
            meta.append({"law_id": r["law_id"], "no": r["no"],
                         "dup_index": r["dup_index"], "chunk_index": ci,
                         "lang": lang})
            texts.append(txt)
    return meta, texts


def encode_parts(emb, texts, batch, label):
    part_dir = os.path.join(OUT, label + "_missing.parts")
    ckpt = os.path.join(OUT, label + "_missing.ckpt")
    os.makedirs(part_dir, exist_ok=True)
    n = len(texts)
    start = 0
    if os.path.exists(ckpt):
        try:
            start = int(io.open(ckpt, encoding="utf-8").read().strip())
        except Exception:
            start = 0
        if start % batch:
            start = 0
    if start:
        log("  ▶ %s 从断点继续：%d / %d" % (label, start, n))
    t0 = time.time()
    for s in range(start, n, batch):
        v = emb.encode(texts[s:s + batch])
        q, sc = embed.quantize(v)
        np.save(os.path.join(part_dir, "p%08d.npy" % s), q)
        np.save(os.path.join(part_dir, "s%08d.npy" % s), sc)
        done = min(n, s + batch)
        if ((s // batch) % 10 == 0) or done == n:
            io.open(ckpt, "w", encoding="utf-8").write(str(done))
        if ((s // batch) % 40 == 0) or done == n:
            el = max(0.1, time.time() - t0)
            rate = (done - start) / el
            eta = (n - done) / rate if rate else 0
            log("    %s %d/%d %.1f%% %.1f 条/秒 剩余 %.0fs" % (
                label, done, n, done * 100.0 / n, rate, eta))
    ps = sorted(f for f in os.listdir(part_dir) if f.startswith("p"))
    ss = sorted(f for f in os.listdir(part_dir) if f.startswith("s"))
    Q = np.vstack([np.load(os.path.join(part_dir, f)) for f in ps])
    S = np.concatenate([np.load(os.path.join(part_dir, f)) for f in ss])
    return Q, S


def write_atomic(path, arr):
    tmp = path + ".tmp.npy"
    np.save(tmp, arr)
    os.replace(tmp, path)


def clean_parts(label):
    """最终索引落盘成功后再清理可续跑分片，失败/中断时保留。"""
    part_dir = os.path.join(OUT, label + "_missing.parts")
    ckpt = os.path.join(OUT, label + "_missing.ckpt")
    removed = 0
    if os.path.isdir(part_dir):
        removed = len([f for f in os.listdir(part_dir) if f.endswith(".npy")])
        shutil.rmtree(part_dir, ignore_errors=True)
    try:
        if os.path.exists(ckpt):
            os.remove(ckpt)
    except OSError:
        pass
    log("  ✓ 已清理构建分片：%s（%d 个）" % (part_dir, removed))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--batch", type=int, default=4)
    args = ap.parse_args()

    log("数据库: " + DB)
    log("输出: " + OUT)
    log("maxLen=%d stride=%d maxChunks=%d" % (MAX_LEN, STRIDE, MAX_CHUNKS))
    meta, texts = load_chunks(args.limit)
    log("条文切片：%d 条（来源 %s）" % (len(texts), args.limit if args.limit else "全库"))

    if args.dry:
        dist = {}
        for m in meta:
            dist[m["lang"]] = dist.get(m["lang"], 0) + 1
        log("语言分布：%s" % json.dumps(dist, ensure_ascii=False))
        log("dry-run：将写入 %d 个 chunk 向量" % len(texts))
        return 0

    if not os.path.exists(os.path.join(embed.MODEL_DIR, "model.onnx")):
        log("模型未下载：%s" % embed.MODEL_DIR)
        return 2
    os.makedirs(OUT, exist_ok=True)
    if os.path.exists(os.path.join(OUT, "chunk_vecs.i8.npy")):
        shutil.copy2(os.path.join(OUT, "chunk_vecs.i8.npy"), os.path.join(OUT, "chunk_vecs.i8.npy.before-chunks"))
        shutil.copy2(os.path.join(OUT, "chunk_scale.npy"), os.path.join(OUT, "chunk_scale.npy.before-chunks"))
    emb = embed.Embedder(embed.MODEL_DIR)
    Q, S = encode_parts(emb, texts, max(1, args.batch), "chunk")
    write_atomic(os.path.join(OUT, "chunk_vecs.i8.npy"), Q)
    write_atomic(os.path.join(OUT, "chunk_scale.npy"), S)
    with open(os.path.join(OUT, "chunk_meta.json.tmp"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False)
    os.replace(os.path.join(OUT, "chunk_meta.json.tmp"), os.path.join(OUT, "chunk_meta.json"))
    manifest = {
        "model": "BAAI/bge-m3", "maxLen": MAX_LEN, "stride": STRIDE,
        "maxChunks": MAX_CHUNKS, "quant": "int8-symmetric-per-row",
        "count": int(Q.shape[0]), "dim": int(Q.shape[1]),
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    with open(os.path.join(OUT, "manifest.json.tmp"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    os.replace(os.path.join(OUT, "manifest.json.tmp"), os.path.join(OUT, "manifest.json"))
    clean_parts("chunk")
    log("完成：" + json.dumps(manifest, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
