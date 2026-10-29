# -*- coding: utf-8 -*-
"""
pasal.id 全文抽取器 v2
- TOC(pasals) 从 RSC 载荷解析，得到完整条号顺序与所属 BAB
- 逐条正文：主页面优先，缺失则抓 /pasal-N 单条页
- 保留款(ayat)与项(huruf)层级
输出 _work/id/out/<lawId>.json
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
import harvest as H
from lxml import html as LH

OUT = os.path.join(HERE, "out")
PAGES = os.path.join(HERE, "pages")
os.makedirs(OUT, exist_ok=True)
os.makedirs(PAGES, exist_ok=True)

LAWS = {
    "ID-INVEST-2007": "uu/uu-no-25-tahun-2007",
    "ID-CIPTA-2020": "uu/uu-no-11-tahun-2020",
    "ID-LABOR-2003": "uu/uu-no-13-tahun-2003",
    "ID-COPYRIGHT-2014": "uu/uu-no-28-tahun-2014",
    "ID-PDP-2022": "uu/uu-no-27-tahun-2022",
    "ID-COMPANY-2007": "uu/uu-no-40-tahun-2007",
    "ID-ARBITRATION-1999": "uu/uu-no-30-tahun-1999",
    "ID-CIPTA-2023": "uu/uu-no-6-tahun-2023",
    "ID-LABOR-PP-2021": "pp/pp-no-35-tahun-2021",
    "ID-ETRANSACTION-2019": "pp/pp-no-71-tahun-2019",
    "ID-TRADE-2014": "uu/uu-no-7-tahun-2014",
    "ID-SCIENCE-2019": "uu/uu-no-11-tahun-2019",
}
BLOCK = 'text-base leading-relaxed whitespace-pre-wrap'


def cached(url, fn, min_size=5000):
    if os.path.exists(fn) and os.path.getsize(fn) > min_size:
        return open(fn, encoding="utf-8").read()
    last = None
    for attempt in range(4):
        try:
            t = H.get_text(url, retries=1, timeout=60, cache=False)
            open(fn, "w", encoding="utf-8").write(t)
            return t
        except Exception as e:
            last = e
            import time
            time.sleep(4 + 5 * attempt)
    raise last


def main_html(lawid, path):
    return cached("https://pasal.id/peraturan/" + path,
                  os.path.join(PAGES, lawid + ".main.html"), 10000)


def pasal_html(lawid, path, num):
    return cached("https://pasal.id/peraturan/%s/pasal-%s" % (path, num),
                  os.path.join(PAGES, "%s.pasal-%s.html" % (lawid, num)), 5000)


def rsc_blob(t):
    blocks = re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)', t, re.S)
    parts = []
    for b in blocks:
        try:
            parts.append(json.loads(b))
        except Exception:
            parts.append(b)
    return "".join(parts)


def parse_toc(blob):
    m = re.search(r'"pasals":\[(.*?)\]', blob, re.S)
    pasals = []
    if m:
        try:
            pasals = json.loads("[" + m.group(1) + "]")
        except Exception:
            pasals = [{"number": x} for x in re.findall(r'"number":"([^"]+)"', m.group(1))]
    # BAB: {"id":N,"node_type":"bab","number":"I","heading":"..."}
    babs = {}
    for mm in re.finditer(r'\{"id":(\d+),"node_type":"bab","number":"([^"]*)","heading":"([^"]*)"', blob):
        babs[int(mm.group(1))] = {"number": mm.group(2), "heading": mm.group(3)}
    return pasals, babs


def clean_txt(s):
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{2,}", "\n", s)
    return s.strip()


def parse_article(node):
    h3 = node.xpath(".//h3")
    title = ""
    if h3:
        title = re.sub(r"\s+", " ", "".join(h3[0].itertext())).strip()
        title = re.sub(r"(Tautan|Salin)+$", "", title).strip()
    paras = []
    for div in node.xpath('.//div[contains(@class,"%s")]' % BLOCK):
        txt = clean_txt(div.text_content())
        if txt and (not paras or paras[-1] != txt):
            paras.append(txt)
    pen = []
    for div in node.xpath('.//div[contains(@class,"mt-2")]//div[contains(@class,"%s")]' % BLOCK):
        txt = clean_txt(div.text_content())
        if txt and txt not in pen:
            pen.append(txt)
    return {"title": title, "paragraphs": paras, "penjelasan": pen}


def collect(html_text):
    doc = LH.fromstring(html_text)
    out = {}
    for a in doc.xpath('//article[starts-with(@id,"pasal-")]'):
        m = re.match(r"pasal-(.+)$", a.get("id"))
        if not m:
            continue
        rec = parse_article(a)
        if rec["paragraphs"]:
            out[m.group(1)] = rec
    return out


def sort_key(lbl):
    m = re.match(r"^(\d+)(.*)$", lbl)
    if not m:
        return (10 ** 6, lbl)
    return (int(m.group(1)), m.group(2))


def run(only=None):
    rep = {}
    for lawid, path in LAWS.items():
        if only and lawid not in only:
            continue
        try:
            main = main_html(lawid, path)
            arts = collect(main)
            blob = rsc_blob(main)
            pasals, babs = parse_toc(blob)
            order = [str(p["number"]) for p in pasals]
            parent = {str(p["number"]): p.get("parent_id") for p in pasals}
            order = list(dict.fromkeys(order))
            print("%-24s TOC=%3d 首页有正文=%3d" % (lawid, len(order), len(arts)))
            miss = [n for n in order if n not in arts]
            print("      缺 %d 条：%s" % (len(miss), miss[:30]))
            for n in miss:
                try:
                    got = collect(pasal_html(lawid, path, n))
                    if n in got:
                        arts[n] = got[n]
                    else:
                        print("      ! 仍缺 Pasal %s" % n)
                except Exception as e:
                    print("      ! 抓取 Pasal %s 失败 %s" % (n, str(e)[:60]))
            arts_sorted = sorted(arts.items(), key=lambda kv: sort_key(kv[0]))
            result = {"lawId": lawid, "path": path,
                      "babs": babs, "articles": [
                          {"label": k, "title": v["title"], "paragraphs": v["paragraphs"],
                           "penjelasan": v["penjelasan"], "parent": parent.get(k)}
                          for k, v in arts_sorted]}
            result["missing"] = [n for n in order if n not in arts]
            json.dump(result, open(os.path.join(OUT, lawid + ".json"), "w", encoding="utf-8"),
                      ensure_ascii=False, indent=1)
            rep[lawid] = {"toc": len(order), "got": len(result["articles"]), "missing": result["missing"][:20]}
        except Exception as e:
            print("ERR", lawid, str(e)[:150])
            rep[lawid] = {"error": str(e)[:150]}
    json.dump(rep, open(os.path.join(OUT, "_report.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    for k, v in rep.items():
        print("%-24s %s" % (k, json.dumps(v, ensure_ascii=False)))


if __name__ == "__main__":
    run(sys.argv[1:] or None)
