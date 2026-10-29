import sys, os
sys.path.insert(0, os.path.abspath(r"_work\tools"))
import harvest as H

# 1) 新加坡 PDPA 全文 HTML
try:
    html = H.get_text("https://sso.agc.gov.sg/Act/PDPA2012?WholeDoc=1")
    txt = H.html_text(html)
    print("SG PDPA chars=%d  sections=%d" % (len(txt), len([l for l in txt.split("\n") if l.strip().startswith("Section ")])))
    print("HEAD:", txt[:200].replace("\n"," | "))
except Exception as e:
    print("SG FAIL:", e)

# 2) 文莱刑法典 PDF 第 1-3 页
try:
    raw = H.get("https://www.agc.gov.bn/wp-content/uploads/2026/07/CAP-22-2021-ED-E-PENAL-CODE-ACT.pdf")
    print("BN pdf bytes:", len(raw))
    t, n = H.pdf_text(raw, pages=range(0, 3))
    print("BN pages:", n, "chars:", len(t))
    print("HEAD:", t[:220].replace("\n"," | "))
except Exception as e:
    print("BN FAIL:", e)
