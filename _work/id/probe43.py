# -*- coding: utf-8 -*-
"""确认 pasal.id 的法规覆盖与其数据来源标注"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
urls = {
    "pasal_uu25": "https://pasal.id/peraturan/uu/uu-no-25-tahun-2007",
    "pasal_uu13": "https://pasal.id/peraturan/uu/uu-no-13-tahun-2003",
    "pasal_uu11_2020": "https://pasal.id/peraturan/uu/uu-no-11-tahun-2020",
    "pasal_uu28": "https://pasal.id/peraturan/uu/uu-no-28-tahun-2014",
    "pasal_uu27": "https://pasal.id/peraturan/uu/uu-no-27-tahun-2022",
    "pasal_uu40": "https://pasal.id/peraturan/uu/uu-no-40-tahun-2007",
    "pasal_uu30": "https://pasal.id/peraturan/uu/uu-no-30-tahun-1999",
    "pasal_uu6_2023": "https://pasal.id/peraturan/uu/uu-no-6-tahun-2023",
    "pasal_pp35_2021": "https://pasal.id/peraturan/pp/pp-no-35-tahun-2021",
    "pasal_pp71_2019": "https://pasal.id/peraturan/pp/pp-no-71-tahun-2019",
    "pasal_uu7_2014": "https://pasal.id/peraturan/uu/uu-no-7-tahun-2014",
    "pasal_uu11_2019": "https://pasal.id/peraturan/uu/uu-no-11-tahun-2019",
}
for tag, u in urls.items():
    try:
        t = H.get_text(u, retries=1, timeout=45)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        txt = H.html_text(t)
        # 统计 Pasal 数
        n = len(set(re.findall(r"Pasal\s+(\d+)\b", txt)))
        print("== %-18s html=%8d text=%7d 唯一Pasal=%3d title=%s" % (
            tag, len(t), len(txt), n,
            (re.search(r"<title[^>]*>(.{0,80}?)</title>", t, re.S).group(1).strip() if re.search(r"<title", t) else "")))
    except Exception as e:
        print("== ERR %-18s %s" % (tag, str(e)[:90]))
