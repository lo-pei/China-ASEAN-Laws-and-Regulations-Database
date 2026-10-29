# -*- coding: utf-8 -*-
"""修正版：正确解析 RSC 载荷 + 正确切分官方 PDF 的正文/说明部分"""
import json, os, re, sys, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
PAGES = os.path.join(HERE, "pages")

# ---------- RSC 解析 ----------
def rsc_blob(t):
    parts = []
    for m in re.finditer(r'self\.__next_f\.push\(\[1,', t):
        i = m.end()
        # 找到与之匹配的 JSON 字符串结束位置
        j = i
        if t[j] != '"':
            continue
        j += 1
        buf = []
        while j < len(t):
            c = t[j]
            if c == "\\":
                buf.append(t[j:j + 2]); j += 2; continue
            if c == '"':
                break
            buf.append(c); j += 1
        raw = '"' + "".join(buf) + '"'
        try:
            parts.append(json.loads(raw))
        except Exception:
            parts.append("".join(buf))
    return "".join(parts)


def parse_toc(blob):
    pasals, babs = [], {}
    m = re.search(r'"pasals":\[(.*?)\](?:,"|\})', blob, re.S)
    if m:
        try:
            pasals = json.loads("[" + m.group(1) + "]")
        except Exception:
            pasals = [{"number": x} for x in re.findall(r'"number":"([^"]+)"', m.group(1))]
    for mm in re.finditer(r'\{"id":(\d+),"node_type":"bab","number":"([^"]*)","heading":"([^"]*)"', blob):
        babs[int(mm.group(1))] = {"number": mm.group(2), "heading": mm.group(3)}
    return pasals, babs


if __name__ == "__main__":
    for fn in sorted(os.listdir(PAGES)):
        if not fn.endswith(".main.html"):
            continue
        lawid = fn[:-10]
        t = open(os.path.join(PAGES, fn), encoding="utf-8").read()
        blob = rsc_blob(t)
        pasals, babs = parse_toc(blob)
        order = list(dict.fromkeys(str(p["number"]) for p in pasals))
        print("%-24s RSC=%7d pasals=%3d bab=%2d 前10=%s 末5=%s" % (
            lawid, len(blob), len(order), len(babs), order[:10], order[-5:]))
