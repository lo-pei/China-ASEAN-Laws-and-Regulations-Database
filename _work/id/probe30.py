# -*- coding: utf-8 -*-
"""检查 Kemnaker 详情页里是否还有别的国家法律(UU)条目；尝试直接在站点内搜索更多目标法律"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
queries = {
    "kn_q_uu25": "https://jdih.kemnaker.go.id/peraturan?keyword=penanaman+modal",
    "kn_q_uu40": "https://jdih.kemnaker.go.id/peraturan?keyword=perseroan+terbatas",
    "kn_q_uu30": "https://jdih.kemnaker.go.id/peraturan?keyword=arbitrase",
    "kn_q_uu28": "https://jdih.kemnaker.go.id/peraturan?keyword=hak+cipta",
    "kn_q_uu27": "https://jdih.kemnaker.go.id/peraturan?keyword=pelindungan+data+pribadi",
    "kn_q_pp35": "https://jdih.kemnaker.go.id/peraturan?keyword=35+tahun+2021",
    "kn_q_pp71": "https://jdih.kemnaker.go.id/peraturan?keyword=71+tahun+2019",
    "kn_q_uu7": "https://jdih.kemnaker.go.id/peraturan?keyword=7+tahun+2014",
}
for tag, u in queries.items():
    try:
        t = H.get_text(u, retries=1, timeout=30)
        links = sorted(set(re.findall(r'href="(/peraturan/detail/\d+/[^"]+)"', t)))
        print("==", tag, len(t), "hits", len(links))
        for l in links[:8]:
            print("    ", l[:130])
    except Exception as e:
        print("== ERR", tag, str(e)[:90])
