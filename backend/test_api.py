#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CALR 后端 · 自测脚本（不依赖 pytest，直接跑）

用法：
    python backend/test_api.py                 # 直连 http://127.0.0.1:8000
    python backend/test_api.py --base http://x  # 指定服务地址

检查项：
  A1  健康检查 ok
  A2  统计数与 laws/ 权威文件数一致
  A3  法域列表覆盖 12 个法域
  A4  列表分页正确（total / pages / items 长度）
  A5  法规详情条文数与 articleCount 一致
  A6  条文结构：no / text 至少一种语言非空
  A7  检索「民法典」→ 中国民法典在首位
  A8  检索「数据法」→ 结果含中国数据安全法
  A9  检索「缅甸仲裁」→ 缅甸仲裁法在首位
  A10 检索延迟在阈值内（默认 1500ms）
  A11 404 对不存在的法规正确返回
  A12 POST /api/qa 返回 citations 且元素结构完整
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LAWS_DIR = os.path.join(ROOT, "prototype", "data", "laws")

ok_n = 0
fail = []
warn = []


def ok(msg=""):
    global ok_n
    ok_n += 1
    if msg:
        print("  ok   " + msg)


def bad(msg):
    fail.append(msg)
    print("  FAIL " + msg)


def warnm(msg):
    warn.append(msg)
    print("  warn " + msg)


BASE = "http://127.0.0.1:8000"


def get(path, params=None, timeout=60):
    url = BASE + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    t0 = time.time()
    with urllib.request.urlopen(url, timeout=timeout) as r:
        d = json.loads(r.read().decode("utf-8"))
    return d, (time.time() - t0) * 1000


def post(path, body, timeout=120):
    req = urllib.request.Request(
        BASE + path, data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=timeout) as r:
        d = json.loads(r.read().decode("utf-8"))
    return d, (time.time() - t0) * 1000


def main():
    global BASE
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:8000")
    ap.add_argument("--latency", type=int, default=1500, help="检索延迟阈值(ms)")
    args = ap.parse_args()
    BASE = args.base.rstrip("/")

    print("  目标: " + BASE)
    print("")

    # A1
    try:
        d, _ = get("/api/health")
        if d.get("ok"):
            ok("A1 健康检查 ok（版本 %s）" % d.get("version"))
        else:
            bad("A1 健康检查返回 ok=false")
    except Exception as e:
        bad("A1 服务不可用: %s" % e)
        report()
        return

    # A2
    try:
        d, _ = get("/api/stats")
        files = [f for f in os.listdir(LAWS_DIR) if f.endswith(".json") and f != "index.json"]
        if d["laws"] == len(files):
            ok("A2 法规数一致: %d" % d["laws"])
        else:
            bad("A2 法规数不一致: API %d / laws/ %d" % (d["laws"], len(files)))
        if d["articles"] > 0:
            ok("A2 条文数: %s" % d["articles"])
        else:
            bad("A2 条文数为 0")
    except Exception as e:
        bad("A2 %s" % e)

    # A3
    try:
        d, _ = get("/api/countries")
        codes = {x["code"] for x in d["items"]}
        expect = {"CN", "VN", "TH", "MY", "SG", "ID", "PH", "KH", "LA", "MM", "BN", "TL"}
        miss = expect - codes
        if not miss:
            ok("A3 12 个法域齐全")
        else:
            bad("A3 缺少法域: %s" % ",".join(sorted(miss)))
    except Exception as e:
        bad("A3 %s" % e)

    # A4
    try:
        d, _ = get("/api/laws", {"page": 2, "size": 7})
        if d["page"] == 2 and d["size"] == 7 and len(d["items"]) <= 7 and d["pages"] >= 1:
            ok("A4 分页正确（total %d / pages %d / 本页 %d）" % (d["total"], d["pages"], len(d["items"])))
        else:
            bad("A4 分页异常: page=%s size=%s items=%s" % (d["page"], d["size"], len(d["items"])))
    except Exception as e:
        bad("A4 %s" % e)

    # A5 / A6
    try:
        d, _ = get("/api/laws/CN-CIVILCODE-2020")
        n = len(d.get("articles") or [])
        if n == d.get("articleCount"):
            ok("A5 民法典条文数与 articleCount 一致: %d" % n)
        else:
            bad("A5 民法典条文数不一致: 实际 %d / articleCount %d" % (n, d.get("articleCount")))
        if n > 0:
            a = d["articles"][0]
            if a.get("no") is not None and any(a.get("text", {}).values()):
                ok("A6 首条结构完整（no=%s，语种 %s）" % (a["no"], ",".join(a["text"].keys())))
            else:
                bad("A6 首条缺 no 或正文")
    except Exception as e:
        bad("A5/A6 %s" % e)

    # A7
    try:
        d, ms = get("/api/search", {"q": "民法典", "size": 5})
        if d["items"]:
            first = d["items"][0]
            t = (first["title"].get("zh") or "")
            if first["country"] == "CN" and "民法典" in t:
                ok("A7 「民法典」首位 = %s（%.0fms）" % (t, ms))
            else:
                bad("A7 「民法典」首位不是中国民法典：%s %s" % (first["country"], t))
        else:
            bad("A7 「民法典」无结果")
    except Exception as e:
        bad("A7 %s" % e)

    # A8
    try:
        d, ms = get("/api/search", {"q": "数据法", "mode": "semantic", "size": 20})
        hit = any(x["country"] == "CN" and "数据安全法" in (x["title"].get("zh") or "")
                  for x in d["items"])
        if hit:
            ok("A8 「数据法」结果含中国数据安全法（%.0fms）" % ms)
        else:
            bad("A8 「数据法」前 20 无中国数据安全法")
    except Exception as e:
        bad("A8 %s" % e)

    # A9
    try:
        d, ms = get("/api/search", {"q": "缅甸仲裁", "mode": "semantic", "size": 5})
        if d["items"]:
            first = d["items"][0]
            t = (first["title"].get("zh") or "")
            if first["country"] == "MM" and "仲裁" in t:
                ok("A9 「缅甸仲裁」首位 = %s（%.0fms）" % (t, ms))
            else:
                bad("A9 「缅甸仲裁」首位异常：%s %s" % (first["country"], t))
        else:
            bad("A9 「缅甸仲裁」无结果")
    except Exception as e:
        bad("A9 %s" % e)

    # A10
    try:
        worst = 0
        for q in ["民法典", "数据法", "个人信息保护", "外商投资", "劳动法"]:
            _, ms = get("/api/search", {"q": q, "size": 20})
            worst = max(worst, ms)
        if worst <= args.latency:
            ok("A10 检索延迟 %.0fms ≤ 阈值 %dms" % (worst, args.latency))
        else:
            warnm("A10 检索延迟 %.0fms 超过阈值 %dms" % (worst, args.latency))
    except Exception as e:
        bad("A10 %s" % e)

    # A11
    try:
        get("/api/laws/THIS-LAW-DOES-NOT-EXIST")
        bad("A11 不存在的法规未返回 404")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            ok("A11 不存在的法规正确返回 404")
        else:
            bad("A11 期望 404，实际 %d" % e.code)
    except Exception as e:
        bad("A11 %s" % e)

    # A12
    try:
        d, ms = post("/api/qa", {"question": "数据法", "topk": 4})
        cs = d.get("citations") or []
        if cs and all(k in cs[0] for k in ("lawId", "lawTitle", "country", "no", "text")):
            ok("A12 /api/qa 返回 %d 条依据（%.0fms，mode=%s）" % (len(cs), ms, d.get("mode")))
        else:
            bad("A12 /api/qa 依据为空或缺字段")
    except Exception as e:
        bad("A12 %s" % e)

    report()


def report():
    print("")
    if fail:
        print("  ✗ 失败 %d 项：" % len(fail))
        for x in fail:
            print("      - " + x)
    if warn:
        print("  ⚠ 警告 %d 项：" % len(warn))
        for x in warn:
            print("      - " + x)
    print("")
    print("  ===== 后端自测：%s（%d 项通过 / %d 项失败）=====" % (
        "全部通过" if not fail else "不通过", ok_n, len(fail)))
    sys.exit(0 if not fail else 1)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
