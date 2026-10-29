# -*- coding: utf-8 -*-
"""
重抓第 3 步：把抓到的结果应用回 prototype/data/laws/

安全检查（任一不满足就跳过该法规）：
  ① 条号必须连续或严格递增，且第 1 条存在
  ② 每条正文非空
  ③ 条数必须 >= 现有的 90%
  ④ 语言键沿用现有的（不新造）
另外：
  · 备份被覆盖的原文件到 _work/crawl/backup/
  · 保留原有 id / title / country / level 等元数据，只替换 articles 与 chars
  · chapter 字段用 {zh: ...} 还是 {en: ...} 取决于该法规原文语种
"""
import io
import json
import os
import shutil
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
OKDIR = os.path.join(ROOT, "_work/crawl/ok")
LAWS = os.path.join(ROOT, "prototype/data/laws")
BK = os.path.join(ROOT, "_work/crawl/backup")
os.makedirs(BK, exist_ok=True)

MAP1252 = {
    "\x91": "\u2018", "\x92": "\u2019", "\x93": "\u201c", "\x94": "\u201d",
    "\x96": "\u2013", "\x97": "\u2014", "\x85": "\u2026", "\x95": "\u2022",
    "\x82": "\u201a", "\x84": "\u201e", "\x86": "\u2020", "\x87": "\u2021",
    "\x89": "\u2030", "\x8b": "\u2039", "\x9b": "\u203a", "\x99": "\u2122",
}


def fix_encoding(t):
    """lawphil 有的页面是 cp1252，按 latin-1 解会留下 \\x97 这类控制字符。
    cp1252 里 0x80-0x9F 有对应可见字符，这里做一次还原。"""
    if not t:
        return t
    return "".join(MAP1252.get(ch, " ") if 0x80 <= ord(ch) <= 0x9F else ch for ch in t)


applied, skipped = [], []
for f in sorted(os.listdir(OKDIR)):
    if not f.endswith(".json"):
        continue
    lid = f[:-5]
    p = json.load(io.open(os.path.join(OKDIR, f), encoding="utf-8"))
    newArts = p.get("articles") or []
    lp = os.path.join(LAWS, lid + ".json")
    if not os.path.exists(lp):
        skipped.append((lid, "原文件不存在"))
        continue
    o = json.load(io.open(lp, encoding="utf-8"))
    oldArts = o.get("articles") or []
    oldN = len(oldArts)

    # ① 条号检查
    nos = [a["no"] for a in newArts]
    if not nos or nos[0] != 1:
        skipped.append((lid, "第 1 条缺失"))
        continue
    if len(set(nos)) != len(nos):
        skipped.append((lid, "条号重复"))
        continue
    if any(nos[i] > nos[i + 1] for i in range(len(nos) - 1)):
        skipped.append((lid, "条号非递增"))
        continue
    # ② 正文非空
    if any(not (a.get("text") or "").strip() for a in newArts):
        skipped.append((lid, "有条文正文为空"))
        continue
    # ③ 条数
    if len(newArts) < oldN * 0.9:
        skipped.append((lid, "新条数 %d < 现有 %d 的 90%%" % (len(newArts), oldN)))
        continue

    # ④ 原文语种
    lang = "en"
    for a in oldArts:
        t = a.get("text") or {}
        k = next((kk for kk, vv in t.items() if vv), None)
        if k:
            lang = k
            break

    # 构造新 articles
    outArts = []
    for a in newArts:
        ch = a.get("chapter")
        item = {
            "id": "%s-A%d" % (o.get("id") or lid, a["no"]),
            "no": a["no"],
            "noLabel": {"zh": "第%d条" % a["no"]} if lang == "zh" else {"en": "Section %d." % a["no"]},
            "text": {lang: fix_encoding(a["text"]).strip()},
        }
        if a.get("heading"):
            item["heading"] = {lang: fix_encoding(a["heading"]).strip()}
        if ch:
            item["chapter"] = {lang: fix_encoding(ch).strip()}
        outArts.append(item)

    bkPath = os.path.join(BK, lid + ".json")
    if not os.path.exists(bkPath):
        shutil.copy2(lp, bkPath)
    tot = sum(len(v) for a in outArts for v in a["text"].values())
    o["articles"] = outArts
    o["articleCount"] = len(outArts)
    o["chars"] = tot
    o["recrawled"] = "2026-10-24 从 %s 重抓，%d → %d 条" % (p.get("url", ""), oldN, len(outArts))
    io.open(lp, "w", encoding="utf-8").write(json.dumps(o, ensure_ascii=False, indent=1))
    applied.append((lid, oldN, len(outArts), len(p.get("chapters") or [])))

print("  应用: %d 部" % len(applied))
for lid, a0, a1, nc in applied[:25]:
    print("    %-16s %4d → %4d 条  章 %2d" % (lid, a0, a1, nc))
if len(applied) > 25:
    print("    … 共 %d 部" % len(applied))
print("")
print("  跳过: %d 部" % len(skipped))
for lid, why in skipped[:15]:
    print("    %-16s %s" % (lid, why))
json.dump({"applied": applied, "skipped": skipped},
          io.open(os.path.join(ROOT, "_work/crawl/apply-result.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
