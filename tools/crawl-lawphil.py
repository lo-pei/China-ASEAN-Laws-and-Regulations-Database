# -*- coding: utf-8 -*-
"""
重抓第 1 步：抓取 + 解析（先只做 lawphil.net，649 部菲律宾法规）

lawphil.net 的页面结构（实测）：
  <p align="center"><b>Chapter I<br>Establishment and Organization ...</b></p>
  <p align="center"><b>ARTICLE I<br>CREATION, RESPONSIBILITIES ...</b></p>
  <p align="justify"><b>Section 1.</b> <i>Creation of the Central Bank.</i> -There is hereby created ...</p>
  <p align="justify">The capital of the Central Bank shall be ...</p>

也就是：
  · 章／节标题：居中的 <b> 且内含 <br>
  · 条文：以 <b>Section N</b> 开头的段落
  · 条文后续段落：同一条的续文
"""
import csv
import html
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
OUT = os.path.join(ROOT, "_work/crawl")
os.makedirs(OUT, exist_ok=True)

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"


def fetch(url, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
        ctype = r.headers.get("Content-Type", "")
    for enc in ["utf-8", "latin-1"]:
        try:
            return raw.decode(enc), ctype
        except Exception:
            continue
    return raw.decode("utf-8", "replace"), ctype


def strip_tags(s):
    s = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", s)
    s = re.sub(r"(?i)<br\s*/?>", "\n", s)
    s = re.sub(r"(?i)</p\s*>", "\n", s)
    s = re.sub(r"(?s)<[^>]+>", "", s)
    s = html.unescape(s)
    s = s.replace("\u00a0", " ")
    # 归一空白，但保留换行
    s = re.sub(r"[ \t\u3000]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n", s)
    return s.strip()


RE_SECTION = re.compile(r"(?m)^\s*Section\s+(\d{1,4})\s*\.?\s*(.*)$")
RE_HEAD = re.compile(r"(?m)^\s*((?:Chapter|CHAPTER|Article|ARTICLE|Title|TITLE|Part|PART)\s+[IVXLC0-9]+[^\n]{0,120})$")


def parse_lawphil(raw_html):
    """返回 {title, chapters:[...], articles:[{no, heading, text, chapter}]}"""
    # 先按 <p> 切块，保留结构
    blocks = re.findall(r"(?is)<p[^>]*>(.*?)</p>", raw_html)
    if not blocks:
        blocks = [raw_html]
    arts, chapters = [], []
    cur_chapter = None
    cur = None
    for b in blocks:
        txt = strip_tags(b).strip()
        if not txt:
            continue
        # 纯标题块（原始 b 里含 <br> 且没有 Section 字样）
        if re.search(r"(?i)<br\s*/?>", b) and not re.search(r"(?i)\bSection\s+\d", txt):
            plain = re.sub(r"\s+", " ", txt).strip()
            if re.match(r"(?i)^(chapter|article|title|part)\s+[IVXLC0-9]+", plain):
                cur_chapter = plain
                chapters.append(plain)
                continue
        m = RE_SECTION.match(txt)
        if m:
            if cur:
                arts.append(cur)
            cur = {"no": int(m.group(1)),
                   "heading": m.group(2).strip()[:120],
                   "text": txt,
                   "chapter": cur_chapter}
            continue
        if cur:
            cur["text"] += "\n" + txt
        else:
            # Section 1 之前的前言，丢弃（但记下来）
            pass
    if cur:
        arts.append(cur)
    return {"chapters": chapters, "articles": arts}


# ---------------------------------------------------------------- 单部验证
def verify_one(law_id, url):
    print("  抓取 %s" % url)
    try:
        raw, ctype = fetch(url)
    except Exception as e:
        print("    ✗ 失败: %s" % e)
        return None
    print("    HTTP OK  %s  长度 %d" % (ctype[:30], len(raw)))
    p = parse_lawphil(raw)
    print("    章: %d   条: %d" % (len(p["chapters"]), len(p["articles"])))
    for a in p["articles"][:4]:
        print("      第%s条 heading=%r" % (a["no"], a["heading"][:40]))
        print("        章=%r" % (a["chapter"] or "")[:60])
        print("        正文 %d 字: %r" % (len(a["text"]), a["text"][:100].replace("\n", " ⏎ ")))
    # 对比现有
    lp = os.path.join(ROOT, "prototype/data/laws", law_id + ".json")
    if os.path.exists(lp):
        o = json.load(io.open(lp, encoding="utf-8"))
        print("    现有: %d 条, 有章字段=%s" % (
            len(o.get("articles") or []),
            any(a.get("chapter") for a in (o.get("articles") or []))))
    return p


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "PH-H359"
    url = sys.argv[2] if len(sys.argv) > 2 else "https://lawphil.net/statutes/repacts/ra1948/ra_265_1948.html"
    p = verify_one(target, url)
    if p:
        io.open(os.path.join(OUT, target + ".raw.json"), "w", encoding="utf-8").write(
            json.dumps(p, ensure_ascii=False, indent=1))
        print("")
        print("  ✓ 已写出 _work/crawl/%s.raw.json" % target)
