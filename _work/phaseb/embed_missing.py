#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""增量补齐向量（不重嵌已有条目；法规内容升级时重嵌法规级全部）。

用法：
  python _work/phaseb/embed_missing.py --level both --dry
  python _work/phaseb/embed_missing.py --level article            # 只补缺失条文向量
  python _work/phaseb/embed_missing.py --level law --law-content  # 法规向量内容升级（全部法规）
  python _work/phaseb/embed_missing.py --level both --law-content # 先法规升级，再补条文

说明：
- 已有向量按 id/meta 保留；库中已删除的向量条目会被过滤；
- 新条文向量使用 CALR_MAX_LEN（默认 512）；旧条文向量仍是旧长度，
  这是本脚本「先补覆盖」的折中，最终 512+单语种+窗口切片见 VECTOR-UPGRADE-PLAN.md；
- 写入前把旧向量复制为 *.before-incremental；中断后可直接重跑（编码按批次写 parts）。
"""
from __future__ import annotations

import argparse
import io
import json
import os
import shutil
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "_work", "pylibs"))

import numpy as np  # noqa: E402
import embed  # noqa: E402


def _backup(path):
    if os.path.exists(path):
        b = path + ".before-incremental"
        if not os.path.exists(b):
            shutil.copy2(path, b)


def _write_atomic(path, arr):
    tmp = path + ".tmp"
    np.save(tmp, arr)
    os.replace(tmp, path)


def _existing_law():
    ids_path = os.path.join(embed.OUT, "law_ids.json")
    vec = os.path.join(embed.OUT, "law_vecs.i8.npy")
    sc = os.path.join(embed.OUT, "law_scale.npy")
    if not (os.path.exists(ids_path) and os.path.exists(vec) and os.path.exists(sc)):
        return [], None, None
    ids = json.load(open(ids_path, encoding="utf-8"))
    return ids, np.load(vec), np.load(sc)


def _existing_articles():
    meta_path = os.path.join(embed.OUT, "article_meta.json")
    vec = os.path.join(embed.OUT, "article_vecs.i8.npy")
    sc = os.path.join(embed.OUT, "article_scale.npy")
    if not (os.path.exists(meta_path) and os.path.exists(vec) and os.path.exists(sc)):
        return [], None, None
    meta = json.load(open(meta_path, encoding="utf-8"))
    return meta, np.load(vec), np.load(sc)


def _key(m):
    return (m["law_id"], m.get("no"), m.get("dup_index"))


def encode_batched(emb, texts, label, batch=None, resume=True):
    """分批编码并写 parts/ckpt，支持中断续跑；返回 (int8 向量, scale)。"""
    batch = max(1, int(batch or embed.BATCH))
    n = len(texts)
    part_dir = os.path.join(embed.OUT, label + "_missing.parts")
    ckpt = os.path.join(embed.OUT, label + "_missing.ckpt")
    os.makedirs(part_dir, exist_ok=True)
    start = 0
    if resume and os.path.exists(ckpt):
        try:
            start = int(io.open(ckpt, encoding="utf-8").read().strip())
        except Exception:
            start = 0
        if start % batch:
            start = 0
    if start:
        print("  ▶ %s 从断点继续：%d / %d" % (label, start, n), flush=True)
    t0 = time.time()
    for s in range(start, n, batch):
        chunk = texts[s:s + batch]
        v = emb.encode(chunk)
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
            print("    %s %d/%d %.1f%% %.1f 条/秒 剩余 %.0fs" % (
                label, done, n, done * 100.0 / n, rate, eta), flush=True)
    ps = sorted(f for f in os.listdir(part_dir) if f.startswith("p"))
    ss = sorted(f for f in os.listdir(part_dir) if f.startswith("s"))
    if not ps:
        return np.zeros((0, 1024), dtype=np.int8), np.zeros((0,), dtype=np.float32)
    Q = np.vstack([np.load(os.path.join(part_dir, f)) for f in ps])
    S = np.concatenate([np.load(os.path.join(part_dir, f)) for f in ss])
    # 成功合并后才清理断点
    try:
        for f in os.listdir(part_dir):
            os.remove(os.path.join(part_dir, f))
        os.rmdir(part_dir)
        os.remove(ckpt)
    except Exception:
        pass
    return Q, S


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", choices=["law", "article", "both"], default="both")
    ap.add_argument("--dry", action="store_true")
    ap.add_argument("--law-content", action="store_true")
    ap.add_argument("--batch", type=int, default=0)
    args = ap.parse_args()
    if args.batch:
        embed.BATCH = args.batch

    all_ids, all_texts = embed.load_laws(0, content=args.law_content)
    meta, texts = embed.load_articles(0)
    print("当前库：法规 %d / 条文 %d" % (len(all_ids), len(meta)))

    if args.dry:
        lids, _, _ = _existing_law()
        ameta, _, _ = _existing_articles()
        law_missing = len(all_ids) if args.law_content else len([x for x in all_ids if x not in set(lids)])
        akeys = set(_key(m) for m in ameta)
        art_missing = len([m for m in meta if _key(m) not in akeys])
        print("dry-run：法规需处理 %d（%s），条文需补 %d"
              % (law_missing, "内容升级全量" if args.law_content else "仅缺失", art_missing))
        return 0

    if not os.path.exists(os.path.join(embed.MODEL_DIR, "model.onnx")):
        print("模型未下载：%s" % embed.MODEL_DIR)
        return 2
    emb = embed.Embedder(embed.MODEL_DIR)
    os.makedirs(embed.OUT, exist_ok=True)
    man_path = os.path.join(embed.OUT, "manifest.json")
    manifest = {}
    if os.path.exists(man_path):
        try:
            manifest = json.load(open(man_path, encoding="utf-8")) or {}
        except Exception:
            manifest = {}

    if args.level in ("law", "both"):
        old_ids, old_q, old_s = _existing_law()
        by_id = {i: k for k, i in enumerate(all_ids)}
        if args.law_content:
            keep_ids, keep_q, keep_s = [], None, None
        else:
            keep_ids = [i for i in old_ids if i in by_id]
            pos = [old_ids.index(i) for i in keep_ids]
            keep_q = old_q[pos] if old_q is not None and len(pos) else None
            keep_s = old_s[pos] if old_s is not None and len(pos) else None
        have = set(keep_ids)
        missing = [i for i in all_ids if i not in have]
        print("法规：已有 %d，补 %d" % (len(keep_ids), len(missing)))
        if missing:
            _backup(os.path.join(embed.OUT, "law_vecs.i8.npy"))
            _backup(os.path.join(embed.OUT, "law_scale.npy"))
            _backup(os.path.join(embed.OUT, "law_ids.json"))
            newv = [all_texts[by_id[i]] for i in missing]
            q, sc = encode_batched(emb, newv, "law", batch=args.batch)
            Q = np.vstack([keep_q, q]) if keep_q is not None and len(keep_q) else q
            S = np.concatenate([keep_s, sc]) if keep_s is not None and len(keep_s) else sc
            ids = keep_ids + missing
            _write_atomic(os.path.join(embed.OUT, "law_vecs.i8.npy"), Q)
            _write_atomic(os.path.join(embed.OUT, "law_scale.npy"), S)
            json.dump(ids, open(os.path.join(embed.OUT, "law_ids.json.tmp"), "w", encoding="utf-8"), ensure_ascii=False)
            os.replace(os.path.join(embed.OUT, "law_ids.json.tmp"), os.path.join(embed.OUT, "law_ids.json"))
            manifest["law"] = {"count": len(ids), "dim": int(Q.shape[1]),
                               "content": "title+summary+first2+chapters" if args.law_content else manifest.get("law", {}).get("content", "title+summary")}
        else:
            print("法规：无缺失，跳过")

    if args.level in ("article", "both"):
        ameta, aq, asc = _existing_articles()
        cur = {_key(m): i for i, m in enumerate(meta)}
        keep = [i for i, m in enumerate(ameta) if _key(m) in cur]
        keep_meta = [ameta[i] for i in keep]
        keep_q = aq[keep] if aq is not None and len(keep) else None
        keep_s = asc[keep] if asc is not None and len(keep) else None
        have = set(_key(m) for m in keep_meta)
        missing = [i for i, m in enumerate(meta) if _key(m) not in have]
        print("条文：已有 %d，补 %d" % (len(keep_meta), len(missing)))
        if missing:
            _backup(os.path.join(embed.OUT, "article_vecs.i8.npy"))
            _backup(os.path.join(embed.OUT, "article_scale.npy"))
            _backup(os.path.join(embed.OUT, "article_meta.json"))
            newv = [texts[i] for i in missing]
            q, sc = encode_batched(emb, newv, "article", batch=args.batch)
            Q = np.vstack([keep_q, q]) if keep_q is not None and len(keep_q) else q
            S = np.concatenate([keep_s, sc]) if keep_s is not None and len(keep_s) else sc
            outmeta = keep_meta + [meta[i] for i in missing]
            _write_atomic(os.path.join(embed.OUT, "article_vecs.i8.npy"), Q)
            _write_atomic(os.path.join(embed.OUT, "article_scale.npy"), S)
            json.dump(outmeta, open(os.path.join(embed.OUT, "article_meta.json.tmp"), "w", encoding="utf-8"), ensure_ascii=False)
            os.replace(os.path.join(embed.OUT, "article_meta.json.tmp"), os.path.join(embed.OUT, "article_meta.json"))
            manifest["article"] = {"count": len(outmeta), "dim": int(Q.shape[1])}

    manifest.update({"model": "BAAI/bge-m3", "maxLen": embed.MAX_LEN,
                     "quant": "int8-symmetric-per-row",
                     "lawContent": "title+summary+first2+chapters" if args.law_content else manifest.get("lawContent", "title+summary")})
    json.dump(manifest, open(man_path + ".tmp", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    os.replace(man_path + ".tmp", man_path)
    print("完成：", json.dumps(manifest, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
