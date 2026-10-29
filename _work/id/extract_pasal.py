# -*- coding: utf-8 -*-
"""
pasal.id 全文抽取器
- 主页面渲染首批条文；其余条文通过 /pasal-N 单条页补抓
- 逐条保留款/项层级（每个 <div class="space-y-3"> 子块 = 一款）
输出：_work/id/out/<lawId>.json
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
os.makedirs(OUT, exist_ok=True)
MAINCACHE = os.path.join(HERE, "pages")
os.makedirs(MAINCACHE, exist_ok=True)

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


def fetch_main(lawid, path):
    """抓主页面（缓存到磁盘）"""
    fn = os.path.join(MAINCACHE, lawid + ".main.html")
    if os.path.exists(fn) and os.path.getsize(fn) > 10000:
        return open(fn, encoding="utf-8").read()
    t = H.get_text("https://pasal.id/peraturan/" + path, retries=2, timeout=60)
    open(fn, "w", encoding="utf-8").write(t)
    return t


def fetch_pasal(path, num):
    fn = os.path.join(MAINCACHE, "%s.pasal-%s.html" % (path.replace("/", "_"), num))
    if os.path.exists(fn) and os.path.getsize(fn) > 5000:
        return open(fn, encoding="utf-8").read()
    t = H.get_text("https://pasal.id/peraturan/%s/pasal-%s" % (path, num), retries=2, timeout=60)
    open(fn, "w", encoding="utf-8").write(t)
    return t


BLOCK_CLASS = "text-base leading-relaxed whitespace-pre-wrap"


def parse_article(node):
    """从 <article id="pasal-N"> 提取 {no, noLabel, paragraphs[], penjelasan[]}"""
    aid = node.get("id") or ""
    m = re.match(r"pasal-(.+)$", aid)
    if not m:
        return None
    label_no = m.group(1)
    # 标题
    h3 = node.xpath(".//h3")
    title = ""
    if h3:
        title = re.sub(r"\s+", " ", "".join(h3[0].itertext())).strip()
        title = title.replace("Tautan", "").replace("Salin", "").strip()
    if not title:
        title = "Pasal %s" % label_no
    # 正文块：只取 class 含 whitespace-pre-wrap 的 div
    paras = []
    for div in node.xpath('.//div[contains(@class,"%s")]' % BLOCK_CLASS):
        txt = div.text_content()
        txt = txt.replace("\u00a0", " ")
        txt = re.sub(r"[ \t]+", " ", txt)
        txt = re.sub(r"\n{2,}", "\n", txt).strip()
        if txt:
            paras.append(txt)
    # Penjelasan（若有独立文本）
    pen = []
    for div in node.xpath('.//div[contains(@class,"mt-2")]//div[contains(@class,"whitespace-pre-wrap")]'):
        txt = re.sub(r"\s+", " ", div.text_content()).strip()
        if txt:
            pen.append(txt)
    return {"label": label_no, "title": title, "paragraphs": paras, "penjelasan": pen}


def collect_articles(html_text):
    doc = LH.fromstring(html_text)
    out = {}
    for a in doc.xpath('//article[starts-with(@id,"pasal-")]'):
        rec = parse_article(a)
        if rec and rec["paragraphs"]:
            out[rec["label"]] = rec
    return out


def parse_toc(html_text):
    """从 RSC 载荷中解析 BAB/Bagian 与条文顺序"""
    blocks = re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)', html_text, re.S)
    parts = []
    for b in blocks:
        try:
            parts.append(json.loads(b))
        except Exception:
            parts.append(b)
    blob = "".join(parts)
    info = {"pasals": [], "bab": []}
    m = re.search(r'"bab":\[(.*?)\],"pasals":\[(.*?)\]', blob, re.S)
    if m:
        try:
            info["bab"] = json.loads("[" + m.group(1) + "]")
        except Exception:
            pass
        try:
            info["pasals"] = json.loads("[" + m.group(2) + "]")
        except Exception:
            pass
    return info, blob


def main(only=None):
    report = {}
    for lawid, path in LAWS.items():
        if only and lawid not in only:
            continue
        try:
            main_html = fetch_main(lawid, path)
            arts = collect_articles(main_html)
            toc, blob = parse_toc(main_html)
            order = [str(p["number"]) for p in toc["pasals"]] if toc["pasals"] else list(arts.keys())
            missing = [n for n in order if n not in arts]
            print("%-24s 目录=%3d 首页渲染=%3d 待补=%3d" % (lawid, len(order), len(arts), len(missing)))
            for n in missing:
                try:
                    h = fetch_pasal(path, n)
                    got = collect_articles(h)
                    if str(n) in got:
                        arts[str(n)] = got[str(n)]
                    else:
                        print("       ! 单条页缺失 Pasal %s" % n)
                except Exception as e:
                    print("       ! 抓取失败 Pasal %s: %s" % (n, str(e)[:70]))
            # 组装
            result = {"lawId": lawid, "path": path, "toc": toc, "articles": []}
            for n in order:
                if n in arts:
                    rec = arts[n]
                    result["articles"].append({
                        "label": n,
                        "title": rec["title"],
                        "paragraphs": rec["paragraphs"],
                        "penjelasan": rec["penjelasan"],
                    })
            result["missing"] = [n for n in order if n not in arts]
            json.dump(result, open(os.path.join(OUT, lawid + ".json"), "w", encoding="utf-8"),
                      ensure_ascii=False, indent=1)
            report[lawid] = {"toc": len(order), "got": len(result["articles"]), "missing": result["missing"]}
        except Exception as e:
            print("ERR", lawid, str(e)[:150])
            report[lawid] = {"error": str(e)[:150]}
    json.dump(report, open(os.path.join(OUT, "_report.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps(report, ensure_ascii=False, indent=1)[:3000])


if __name__ == "__main__":
    only = sys.argv[1:] or None
    main(only)
