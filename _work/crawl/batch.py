# -*- coding: utf-8 -*-
"""
重抓第 2 步：批量抓取 lawphil.net（菲律宾，649 部）

策略：
  · 只处理有 lawphil.net 源地址、且在重抓清单里的法规
  · 礼貌抓取：每次间隔 1.2 秒，失败重试 2 次（退避 3s / 8s）
  · 解析后与现有数据比较，**只在明显更好时才采纳**：
      采纳条件（满足任一）：
        a) 新抓条文数 >= 现有 * 1.05（内容更全）
        b) 现有完全没有 chapter，而新抓有（补出章结构）
      否则记为 rejected，不覆盖
  · 结果写到 _work/crawl/ok/ 与 _work/crawl/rejected.json，先不碰 prototype/
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
OKDIR = os.path.join(ROOT, "_work/crawl/ok")
os.makedirs(OKDIR, exist_ok=True)
LOG = os.path.join(ROOT, "_work/crawl/progress.log")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")


def log(msg):
    line = "[%s] %s" % (time.strftime("%H:%M:%S"), msg)
    print(line, flush=True)
    with io.open(LOG, "a", encoding="utf-8") as fh:
        fh.write(line + "\n")


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
    s = html.unescape(s).replace("\u00a0", " ")
    s = re.sub(r"[ \t\u3000]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n", s)
    return s.strip()


RE_SECTION = re.compile(r"(?m)^\s*Section\s+(\d{1,4})\s*\.?\s*(.*)$")


def parse_lawphil(raw_html):
    blocks = re.findall(r"(?is)<p[^>]*>(.*?)</p>", raw_html) or [raw_html]
    arts, chapters = [], []
    cur_chapter = None
    cur = None
    for b in blocks:
        txt = strip_tags(b).strip()
        if not txt:
            continue
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
            cur = {"no": int(m.group(1)), "heading": m.group(2).strip()[:120],
                   "text": txt, "chapter": cur_chapter}
            continue
        if cur:
            cur["text"] += "\n" + txt
    if cur:
        arts.append(cur)
    return {"chapters": chapters, "articles": arts}


def main():
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    rows = []
    with io.open(os.path.join(ROOT, "tools/recrawl-tasks.csv"), encoding="utf-8-sig") as fh:
        for r in csv.DictReader(fh):
            if "lawphil.net" in (r.get("sourceUrl") or ""):
                rows.append(r)
    rows.sort(key=lambda r: int(r["priority"]))
    if limit:
        rows = rows[:limit]
    log("待抓 %d 部（lawphil.net）" % len(rows))

    ok, rejected, failed = [], [], []
    for i, r in enumerate(rows, 1):
        lid, url = r["lawId"], r["sourceUrl"]
        dst = os.path.join(OKDIR, lid + ".json")
        if os.path.exists(dst):
            continue
        try:
            raw, _ = fetch(url)
            p = parse_lawphil(raw)
        except Exception as e:
            failed.append({"lawId": lid, "url": url, "error": str(e)[:160]})
            log("[%d/%d] ✗ %s %s" % (i, len(rows), lid, str(e)[:70]))
            time.sleep(2)
            continue
        nnew = len(p["articles"])
        lp = os.path.join(ROOT, "prototype/data/laws", lid + ".json")
        nold, oldHasCh = 0, False
        if os.path.exists(lp):
            o = json.load(io.open(lp, encoding="utf-8"))
            arts = o.get("articles") or []
            nold = len(arts)
            oldHasCh = any(a.get("chapter") for a in arts)
        newHasCh = bool(p["chapters"]) or any(a.get("chapter") for a in p["articles"])
        better = (nnew >= max(1, int(nold * 1.05))) or (not oldHasCh and newHasCh and nnew >= nold * 0.9)
        if not better:
            rejected.append({"lawId": lid, "old": nold, "new": nnew,
                             "oldHasChapter": oldHasCh, "newHasChapter": newHasCh, "url": url})
            log("[%d/%d] - %s 拒绝 %d→%d" % (i, len(rows), lid, nold, nnew))
        else:
            io.open(dst, "w", encoding="utf-8").write(json.dumps(
                {"lawId": lid, "url": url, "old": nold, "chapters": p["chapters"],
                 "articles": p["articles"]}, ensure_ascii=False, indent=1))
            ok.append(lid)
            log("[%d/%d] ✓ %s %d→%d 章%d" % (i, len(rows), lid, nold, nnew, len(p["chapters"])))
        time.sleep(1.2)

    json.dump({"ok": ok, "rejected": rejected, "failed": failed},
              io.open(os.path.join(ROOT, "_work/crawl/batch-result.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    log("完成：采纳 %d，拒绝 %d，失败 %d" % (len(ok), len(rejected), len(failed)))


if __name__ == "__main__":
    main()
