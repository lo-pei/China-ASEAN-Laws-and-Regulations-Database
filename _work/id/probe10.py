# -*- coding: utf-8 -*-
"""检查 jdih.setneg 列表页是否含 __NEXT_DATA__ / 文档链接；并抓 bkpm 、kemendag 列表"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
os.makedirs(OUT, exist_ok=True)


def dump(tag, url, **kw):
    try:
        t = H.get_text(url, **kw)
    except Exception as e:
        print("ERR", tag, str(e)[:120]); return None
    open(os.path.join(OUT, tag), "w", encoding="utf-8").write(t)
    print("== ", tag, url, len(t))
    m = re.search(r'id="__NEXT_DATA__"[^>]*>(.*?)</script>', t, re.S)
    if m:
        try:
            d = json.loads(m.group(1))
            s = json.dumps(d)
            print("   NEXT_DATA json len", len(s))
            open(os.path.join(OUT, tag + ".json"), "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=1))
        except Exception as e:
            print("   NEXT_DATA parse err", e)
    # 找可能的文档详情链接
    hits = sorted(set(re.findall(r'href="([^"]*(?:peraturan|produk|detail|download|storage)[^"]*)"', t, re.I)))
    for h in hits[:25]:
        print("   link", h[:130])
    # 找 __NEXT_DATA__ 外的 JSON 接口
    for h in sorted(set(re.findall(r'"(/api/[^"]{0,80})"', t)))[:15]:
        print("   api", h)
    return t


dump("setneg_list.html", "https://jdih.setneg.go.id/produk-hukum/instrumen/peraturan", timeout=40)
dump("bkpm_home.html", "https://jdih.bkpm.go.id/", timeout=40)
dump("kemendag_home.html", "https://jdih.kemendag.go.id/", timeout=40)
