# -*- coding: utf-8 -*-
"""把 build_db.py 里的分词函数暴露给 app 包（保持建库与检索同一套口径）。"""
import os
import sys

_BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _BACKEND not in sys.path:
    sys.path.insert(0, _BACKEND)

from build_db import tokenize, CJK, WORD, STOP  # noqa: E402,F401

__all__ = ["tokenize", "CJK", "WORD", "STOP"]
