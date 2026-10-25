# -*- coding: utf-8 -*-
"""
CALR 后端 · 嵌入模型封装（bge-m3 / ONNX Runtime）

为什么用 ONNX 而不是 sentence-transformers：
  · 不需要装 torch（省 2.5 GB 依赖，镜像小一半以上）
  · CPU 上比 torch 快 3~5 倍（ORT 图优化 + 量化）
  · 部署到云服务器时依赖更少、故障面更小

模型文件（_work/models/bge-m3/）：
  model.onnx         图结构（约 0.7 MB）
  model.onnx_data    外部权重（约 1.02 GB）
  tokenizer.json     分词器
  config.json 等
"""
from __future__ import annotations

import os
import sys
import threading
from typing import List, Optional

# ── 开发期依赖引导 ────────────────────────────────────────────────
# 本地开发时 onnxruntime / tokenizers 装在 _work/pylibs（项目统一的可移植依赖目录，
# 与 _work/pylibs 里的 pymupdf 等共用）。生产环境（Docker）由 requirements.txt 安装，
# 这个目录不存在，引导自动跳过。
_DEV_LIBS = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)))), "_work", "pylibs")
if os.path.isdir(_DEV_LIBS) and _DEV_LIBS not in sys.path:
    sys.path.append(_DEV_LIBS)   # append：不覆盖系统已装的包

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.dirname(HERE)
ROOT = os.path.dirname(BACKEND)

DEFAULT_MODEL = os.environ.get("CALR_MODEL") or os.path.join(ROOT, "_work", "models", "bge-m3")
MAX_LEN = int(os.environ.get("CALR_MAX_LEN") or 512)
BATCH = int(os.environ.get("CALR_BATCH") or 8)

_lock = threading.Lock()
_emb: Optional["Embedder"] = None


class Embedder:
    def __init__(self, model_dir: str = DEFAULT_MODEL):
        import onnxruntime as ort
        from tokenizers import Tokenizer

        self.dir = model_dir
        self.tok = Tokenizer.from_file(os.path.join(model_dir, "tokenizer.json"))
        self.tok.enable_truncation(max_length=MAX_LEN)
        self.tok.enable_padding(length=None, pad_id=1, pad_token="<pad>")

        so = ort.SessionOptions()
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        so.intra_op_num_threads = max(1, min(int(os.environ.get("CALR_THREADS") or 8),
                                             os.cpu_count() or 4))
        so.inter_op_num_threads = 1
        self.sess = ort.InferenceSession(
            os.path.join(model_dir, "model.onnx"), so, providers=["CPUExecutionProvider"])
        self.inputs = {i.name for i in self.sess.get_inputs()}
        self.dim: Optional[int] = None

    def encode(self, texts: List[str]) -> np.ndarray:
        """返回 (N, dim) float32，已 L2 归一化。"""
        if not texts:
            return np.zeros((0, self.dim or 1024), dtype=np.float32)
        out_chunks = []
        for s in range(0, len(texts), BATCH):
            batch = list(texts[s:s + BATCH])
            encs = self.tok.encode_batch(batch)
            ids = np.array([e.ids for e in encs], dtype=np.int64)
            mask = np.array([e.attention_mask for e in encs], dtype=np.int64)
            feed = {"input_ids": ids, "attention_mask": mask}
            if "token_type_ids" in self.inputs:
                feed["token_type_ids"] = np.zeros_like(ids)
            h = self.sess.run(None, feed)[0]
            vec = h[:, 0, :] if h.ndim == 3 else h      # CLS 池化（bge 约定）
            n = np.linalg.norm(vec, axis=1, keepdims=True)
            n[n == 0] = 1.0
            vec = (vec / n).astype(np.float32)
            self.dim = vec.shape[1]
            out_chunks.append(vec)
        return np.vstack(out_chunks)


_last_error: Optional[str] = None


def last_error() -> Optional[str]:
    """最近一次加载失败的原因（成功时为 None）。用于诊断，不参与逻辑。"""
    return _last_error


def get() -> Optional[Embedder]:
    """懒加载单例；模型不可用时返回 None（调用方必须判 None 后降级到纯 BM25）。

    注意：这里会把失败原因记到 last_error()。
    旧实现是 `except Exception: return None`，把"为什么加载不了"整个吞掉，
    结果排查时只能看到调用侧一个莫名其妙的 AttributeError。
    """
    global _emb, _last_error
    if _emb is not None:
        return _emb
    with _lock:
        if _emb is not None:
            return _emb
        if not os.path.exists(os.path.join(DEFAULT_MODEL, "model.onnx")):
            _last_error = "缺少 model.onnx（模型目录：%s）" % DEFAULT_MODEL
            return None
        try:
            _emb = Embedder(DEFAULT_MODEL)
            _last_error = None
        except Exception as e:
            _last_error = "%s: %s" % (type(e).__name__, str(e)[:300])
            return None
        return _emb


def available() -> bool:
    """模型文件是否齐全。
    必须同时检查 model.onnx_data —— ONNX 的权重是外部存储的，
    只拷了 0.7 MB 的图而没拷 2.16 GB 的权重时，onnxruntime 会加载失败，
    但只看 model.onnx 会误判为"可用"。
    文件缺失时把原因写进 last_error()，这样 /api/vectors 能直接看出缺哪个。"""
    global _last_error
    d = DEFAULT_MODEL
    has_graph = os.path.exists(os.path.join(d, "model.onnx"))
    has_data = os.path.exists(os.path.join(d, "model.onnx_data"))
    has_tok = os.path.exists(os.path.join(d, "tokenizer.json"))
    if has_graph and has_data and has_tok:
        return True
    miss = []
    if not has_graph:
        miss.append("model.onnx")
    if not has_data:
        miss.append("model.onnx_data（2.16 GB 外部权重）")
    if not has_tok:
        miss.append("tokenizer.json")
    _last_error = "模型目录 %s 缺少：%s" % (d, "、".join(miss))
    return False
