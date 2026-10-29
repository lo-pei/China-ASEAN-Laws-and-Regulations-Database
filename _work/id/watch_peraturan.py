# -*- coding: utf-8 -*-
"""后台持续探测 peraturan.go.id 可达性，一旦可达立即抓取页面与 PDF 直链。"""
import os, re, sys, time, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
os.makedirs(SRC, exist_ok=True)
LOG = os.path.join(HERE, "peraturan_watch.log")

TARGETS = {
    "ID-INVEST-2007": "uu-no-25-tahun-2007",
    "ID-CIPTA-2020": "uu-no-11-tahun-2020",
    "ID-LABOR-2003": "uu-no-13-tahun-2003",
    "ID-COPYRIGHT-2014": "uu-no-28-tahun-2014",
    "ID-PDP-2022": "uu-no-27-tahun-2022",
    "ID-COMPANY-2007": "uu-no-40-tahun-2007",
    "ID-ARBITRATION-1999": "uu-no-30-tahun-1999",
    "ID-CIPTA-2023": "uu-no-6-tahun-2023",
    "ID-LABOR-PP-2021": "pp-no-35-tahun-2021",
    "ID-ETRANSACTION-2019": "pp-no-71-tahun-2019",
    "ID-TRADE-2014": "uu-no-7-tahun-2014",
}


def log(msg):
    line = time.strftime("%H:%M:%S ") + msg
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def try_once(deadline_loops=120, sleep_s=60):
    for i in range(deadline_loops):
        try:
            raw = H.get("https://peraturan.go.id/id/uu-no-25-tahun-2007",
                        retries=1, timeout=25, cache=False)
            log("REACHABLE after %d tries, len=%d" % (i, len(raw)))
            return True
        except Exception as e:
            if i % 5 == 0:
                log("still down (%d): %s" % (i, str(e)[:70]))
            time.sleep(sleep_s)
    log("gave up after %d loops" % deadline_loops)
    return False


def harvest():
    for lawid, slug in TARGETS.items():
        url = "https://peraturan.go.id/id/" + slug
        try:
            t = H.get_text(url, retries=2, timeout=40)
            open(os.path.join(SRC, lawid + ".page.html"), "w", encoding="utf-8").write(t)
            pdfs = sorted(set(re.findall(r'href="([^"]+\.pdf[^"]*)"', t, re.I)))
            log("%s page %d bytes, pdfs=%d" % (lawid, len(t), len(pdfs)))
            for p in pdfs:
                log("   PDF " + p[:160])
            json.dump(pdfs, open(os.path.join(SRC, lawid + ".pdfs.json"), "w"), indent=1)
        except Exception as e:
            log("ERR %s %s" % (lawid, str(e)[:100]))


if __name__ == "__main__":
    if try_once():
        harvest()
        log("DONE")
