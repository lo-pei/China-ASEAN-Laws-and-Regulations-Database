# -*- coding: utf-8 -*-
"""从 法律(1) 的 DOCX 重切中国法章节/条文。

- 有 versionDate/promulgatedDate 与文件名日期一致的：就地更新该版本
- 日期更新且条文数一致：就地更新该法（补 versionDate）
- 日期更新且条文数变化：作为新版本新建 law 记录（旧版本保留）
- 无匹配/无法解析：跳过并报告
用法：python apply_toc.py [--write]
"""
import os, re, json, glob, shutil, sys, collections, datetime
from docx import Document

SRC = r"C:\Users\lenovo\OneDrive\Desktop\法律(1)"
PROJ = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
LAWS = os.path.join(PROJ, "prototype", "data", "laws")
WORK = os.path.join(PROJ, "_work", "toc-redo")
BACK = os.path.join(WORK, "backup")
WRITE = "--write" in sys.argv
CH = re.compile(r"^第[一二三四五六七八九十百千万零〇\d]+章(?:\s|　|$)")
ART = re.compile(r"^第[一二三四五六七八九十百千万零〇\d]+条(?:\s|　|$)")
TOC = re.compile(r"^目\s*录$")
CN_NUM = "零一二三四五六七八九十百千万"


def paras(fp):
    return [p.text.strip() for p in Document(fp).paragraphs if p.text.strip()]


def parse(ps):
    start = 0
    for i, x in enumerate(ps):
        if TOC.match(x):
            start = i + 1
            break
    ai = None
    for i in range(start, len(ps)):
        if ART.match(ps[i]):
            ai = i
            break
    if ai is None:
        return [], []
    ci = ai
    for i in range(ai - 1, start - 1, -1):
        if CH.match(ps[i]):
            ci = i
            break
    chs, arts, cur, ch = [], [], None, None
    for x in ps[ci:]:
        if CH.match(x):
            ch = re.sub(r"\s+", " ", x).strip()
            chs.append(ch)
            cur = None
            continue
        if ART.match(x):
            label = x[:x.find("条") + 1].replace(" ", "").replace("　", "")
            rest = re.sub(r"^第[一二三四五六七八九十百零〇\d]+条", "", x).strip()
            cur = {"label": label, "text": [rest] if rest else [], "chapter": ch}
            arts.append(cur)
            continue
        if cur is not None:
            cur["text"].append(x)
    for a in arts:
        a["text"] = "\n".join([t for t in a["text"] if t.strip()]).strip()
    return chs, arts


def cn_num(s):
    s = s.strip()
    if not s:
        return None
    if s.isdigit():
        return int(s)
    # 简易中文数字（支持到百/千）
    units = {"十": 10, "百": 100, "千": 1000, "万": 10000}
    digits = {"零": 0, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9}
    total = 0
    section = 0
    num = 0
    for c in s:
        if c in digits:
            num = digits[c]
        elif c in units:
            u = units[c]
            if u == 10000:
                section = (section + num) * u
                total += section
                section = 0
            else:
                if num == 0:
                    num = 1
                section += num * u
            num = 0
        else:
            return None
    return total + section + num


def article_objs(law_id, arts):
    out = []
    for i, a in enumerate(arts):
        raw = a["label"][1:-1]
        no = cn_num(raw) or (i + 1)
        obj = {
            "id": "%s-A%d" % (law_id, i + 1),
            "no": no,
            "noLabel": {"zh": a["label"]},
            "text": {"zh": a["text"]},
        }
        if a.get("chapter"):
            obj["chapter"] = {"zh": a["chapter"]}
        out.append(obj)
    return out


def chars_of(arts):
    return sum(len(a.get("text", {}).get("zh", "")) for a in arts)


os.makedirs(BACK, exist_ok=True)
laws = []
for fp in glob.glob(os.path.join(LAWS, "CN-*.json")):
    try:
        laws.append(json.load(open(fp, encoding="utf-8")))
    except Exception:
        pass
by_title = collections.defaultdict(list)
for o in laws:
    t = o.get("title") or {}
    z = (t.get("zh") or "").strip() if isinstance(t, dict) else ""
    if z:
        by_title[z].append(o)
ids = {o["id"] for o in laws}
next_id = 9001

stat = collections.Counter()
rows = []
skip = []
for fp in sorted(glob.glob(os.path.join(SRC, "*.docx"))):
    base = os.path.splitext(os.path.basename(fp))[0]
    m = re.match(r"^(.*)_(\d{8})$", base)
    name = m.group(1).strip() if m else base
    ymd = m.group(2) if m else ""
    date = "%s-%s-%s" % (ymd[:4], ymd[4:6], ymd[6:]) if m else ""
    chs, arts = parse(paras(fp))
    if not arts:
        skip.append((os.path.basename(fp), "no-articles"))
        continue
    cands = by_title.get(name) or by_title.get(name.replace("中华人民共和国", "")) or []
    if not cands:
        skip.append((os.path.basename(fp), "no-title"))
        continue

    def key(o):
        return (o.get("versionDate") or o.get("promulgatedDate") or "")[:10]

    hit = None
    for o in cands:
        if date and date in ((o.get("versionDate") or "")[:10], (o.get("promulgatedDate") or "")[:10]):
            hit = o
            break
    mode = "exact"
    if hit is None:
        latest = sorted(cands, key=key)[-1]
        if date and date > key(latest):
            if len(arts) == int(latest.get("articleCount") or 0):
                hit = latest
                mode = "inplace-new"
            else:
                hit = latest
                mode = "new-version"
        else:
            skip.append((os.path.basename(fp), "older/other", key(latest)))
            continue

    if mode == "new-version":
        while True:
            nid = "CN-LAW-%d" % next_id
            next_id += 1
            if nid not in ids:
                break
        ids.add(nid)
        title = json.loads(json.dumps(hit.get("title") or {}))
        newo = {
            "id": nid,
            "title": title,
            "country": hit.get("country") or "CN",
            "countryName": hit.get("countryName") or "中国",
            "layer": hit.get("layer") or "cn",
            "pack": hit.get("pack") or "cn-p01",
            "language": hit.get("language") or "zh",
            "level": hit.get("level") or "law",
            "category": hit.get("category") or "general",
            "status": hit.get("status") or "active",
            "promulgatedDate": hit.get("promulgatedDate"),
            "effectiveDate": hit.get("effectiveDate"),
            "versionDate": date or hit.get("versionDate"),
            "amendedNote": (date + " 版") if date else "新版",
            "issuingBody": hit.get("issuingBody"),
            "docNumber": hit.get("docNumber"),
            "officialCode": hit.get("officialCode"),
            "topics": hit.get("topics") or [],
            "coverage": "full",
            "structureMode": hit.get("structureMode") or "article",
            "structure": None,
            "source": hit.get("source"),
            "sourceFile": os.path.basename(fp),
            "fetchedAt": date or None,
            "completenessNote": "由 法律(1) DOCX 入库（" + os.path.basename(fp) + "）",
            "articles": article_objs(nid, arts),
        }
        newo["articleCount"] = len(newo["articles"])
        newo["chars"] = chars_of(newo["articles"])
        dest = os.path.join(LAWS, nid + ".json")
        if WRITE:
            json.dump(newo, open(dest, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1)
            open(dest, "a", encoding="utf-8", newline="\n").write("\n")
        old = hit
        if old.get("amendedNote"):
            old["amendedNote"] = old["amendedNote"] + "；已被 %s 替代（%s 版）" % (nid, date)
        else:
            old["amendedNote"] = "已被 %s 替代（%s 版）" % (nid, date)
        if WRITE:
            b = os.path.join(BACK, old["id"] + ".json")
            if not os.path.exists(b):
                shutil.copy2(os.path.join(LAWS, old["id"] + ".json"), b)
            json.dump(old, open(os.path.join(LAWS, old["id"] + ".json"), "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1)
            open(os.path.join(LAWS, old["id"] + ".json"), "a", encoding="utf-8", newline="\n").write("\n")
        stat["new-version"] += 1
        rows.append((name, date, mode, nid, len(arts)))
        continue

    # exact / inplace-new
    old = hit
    b = os.path.join(BACK, old["id"] + ".json")
    if WRITE and not os.path.exists(b):
        shutil.copy2(os.path.join(LAWS, old["id"] + ".json"), b)
    old["articles"] = article_objs(old["id"], arts)
    old["articleCount"] = len(old["articles"])
    old["chars"] = chars_of(old["articles"])
    if date and not old.get("versionDate"):
        old["versionDate"] = date
    elif date and date > (old.get("versionDate") or ""):
        old["versionDate"] = date
    if old.get("structureMode") in (None, "ARTICLE"):
        old["structureMode"] = "article"
    if WRITE:
        json.dump(old, open(os.path.join(LAWS, old["id"] + ".json"), "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1)
        open(os.path.join(LAWS, old["id"] + ".json"), "a", encoding="utf-8", newline="\n").write("\n")
    stat[mode] += 1
    rows.append((name, date, mode, old["id"], len(arts), len(chs)))

with open(os.path.join(WORK, "plan.txt"), "w", encoding="utf-8") as f:
    f.write("write=%s\n" % WRITE)
    f.write("stats=%s\n\n" % dict(stat))
    for r in rows:
        f.write("\t".join(map(str, r)) + "\n")
    f.write("\nSKIP\n")
    for r in skip:
        f.write("\t".join(map(str, r)) + "\n")
print("stats", dict(stat), "skip", len(skip), "write", WRITE)
print("plan", os.path.join(WORK, "plan.txt"))
