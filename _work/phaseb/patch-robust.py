# -*- coding: utf-8 -*-
"""
给 embed.py 打补丁：
  1) 逐批容错：某批失败时自动二分重试，最终失败则用零向量占位并记录
  2) 断点续跑：每 N 批把已完成进度写入 .ckpt 文件，中断后从断点继续
  3) 空文本/异常文本预清洗，避免 DirectML 报 shape 错
"""
import io
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

p = "_work/phaseb/embed.py"
s = io.open(p, encoding="utf-8").read()
orig = s

# ---------- 1) encode 容错 ----------
s = s.replace(
'''    def encode(self, texts):
        """返回 (N, 1024) float32，已 L2 归一化。"""
        encs = self.tok.encode_batch(list(texts))''',
'''    def encode(self, texts):
        """返回 (N, 1024) float32，已 L2 归一化。"""
        texts = [self._clean(t) for t in texts]
        encs = self.tok.encode_batch(list(texts))''')

s = s.replace(
'''        out = self.sess.run(None, feed)''',
'''        try:
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
            return np.vstack([a, b])''')

# ---------- 2) 文本清洗 ----------
s = s.replace(
'''    def encode(self, texts):''',
'''    @staticmethod
    def _clean(t):
        """清洗：去掉 NUL 与不可见控制字符；空串换成占位符。"""
        s = str(t or "")
        s = "".join(ch for ch in s if ch == "\\n" or ch == "\\t" or ord(ch) >= 32)
        s = s.strip()
        return s if s else "(空)"

    def encode(self, texts):''')

# ---------- 3) run() 断点续跑 ----------
s = s.replace(
'''def run(emb: Embedder, label: str, texts, out_vec, out_scale, keep_meta=None, keep_meta_path=None):
    n = len(texts)
    dim = None
    qs, scales = [], []
    t0 = time.time()
    for s in range(0, n, BATCH):
        batch = texts[s:s + BATCH]
        v = emb.encode(batch)
        if dim is None:
            dim = v.shape[1]
            log("  向量维度 %d" % dim)
        q, sc = quantize(v)
        qs.append(q)
        scales.append(sc)
        done = min(n, s + BATCH)
        if done % (BATCH * 20) == 0 or done == n:
            el = time.time() - t0
            sp = done / el if el > 0 else 0
            eta = (n - done) / sp if sp > 0 else 0
            log("    %s %6d/%d  %.1f%%  %.1f 条/秒  已用 %.0fs  剩余 %.0fs" % (
                label, done, n, done * 100.0 / n, sp, el, eta))
    Q = np.vstack(qs) if qs else np.zeros((0, dim or 1024), dtype=np.int8)
    S = np.concatenate(scales) if scales else np.zeros((0,), dtype=np.float32)
    os.makedirs(OUT, exist_ok=True)
    np.save(out_vec, Q)
    np.save(out_scale, S)
    log("  ✓ %s：%d × %d，int8 占 %.1f MB（fp32 需 %.1f MB）" % (
        label, Q.shape[0], Q.shape[1], Q.nbytes / 1048576, Q.size * 4 / 1048576))
    return dim''',
'''def run(emb: Embedder, label: str, texts, out_vec, out_scale, keep_meta=None, keep_meta_path=None):
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
    return dim''')

if s != orig:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ embed.py 已加容错 + 断点续跑")
else:
    print("  ! 未命中")
