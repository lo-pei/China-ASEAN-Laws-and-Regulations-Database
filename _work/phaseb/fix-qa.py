# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "backend/app/main.py"
s = io.open(p, encoding="utf-8").read()
o = s

# 1) 解析 no_label（它是 JSON 字符串 {zh: "第21条"}）
s = s.replace('''def _num_no(no):''',
'''def _label_of(raw, no) -> str:
    """no_label 列存的是 JSON（{"zh":"第21条"}），取中文优先，退英文，再退合成。"""
    if raw:
        v = raw
        if isinstance(raw, str):
            try:
                import json as _j
                v = _j.loads(raw)
            except Exception:
                v = raw
        if isinstance(v, dict):
            for k in ("zh", "en", "orig"):
                if v.get(k):
                    return str(v[k])
            for x in v.values():
                if x:
                    return str(x)
        elif isinstance(v, str) and v.strip():
            return v.strip()
    return ("第" + _fmt_no(no) + "条") if no is not None else ""


def _num_no(no):''')
s = s.replace('''from . import db, search as search_mod, vectors as vec_mod, hybrid as hybrid_mod, embedder''',
              '''from . import db, search as search_mod, vectors as vec_mod, hybrid as hybrid_mod, embedder''')

# 2) 去重键改成「正文内容前 80 字」，可跨重复法规记录收敛
s = s.replace('''        title_zh = r["title_zh"] or r["title_en"] or r["title_orig"] or lid
        key = (title_zh, _fmt_no(meta["no"]))
        if key in seen:
            continue
        seen.add(key)
        a = db.row("SELECT text_zh, text_en, text_orig, lang, no_label, heading FROM articles "
                   "WHERE law_id=? AND no=? AND IFNULL(dup_index,1)=IFNULL(?,1)",
                   (lid, meta["no"], meta["dup_index"]))
        if not a:
            continue''',
'''        title_zh = r["title_zh"] or r["title_en"] or r["title_orig"] or lid
        a = db.row("SELECT text_zh, text_en, text_orig, lang, no_label, heading FROM articles "
                   "WHERE law_id=? AND no=? AND IFNULL(dup_index,1)=IFNULL(?,1)",
                   (lid, meta["no"], meta["dup_index"]))
        if not a:
            continue
        # 去重键：条文正文前 80 字。语料里同一部法常有多个记录（标题可能为空或带 _2010 后缀），
        # 只按「标题+条号」去重抓不住；用正文内容才能跨记录收敛到同一条文。
        body_key = ((a["text_zh"] or a["text_en"] or a["text_orig"] or "").strip())[:80]
        key = body_key if body_key else (title_zh, _fmt_no(meta["no"]))
        if key in seen:
            continue
        seen.add(key)''')

# 3) noLabel 用 _label_of
s = s.replace('''            "noLabel": a["no_label"] or ("第" + _fmt_no(meta["no"]) + "条"),''',
              '''            "noLabel": _label_of(a["no_label"], meta["no"]),''')

if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已修 noLabel 解析与正文去重")
else:
    print("  ! 锚点未命中")
