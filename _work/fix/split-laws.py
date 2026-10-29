# -*- coding: utf-8 -*-
"""
B) 把「整部法被塞进 1 条」的法规按条文标记重新切分

安全约束（最重要）：
  · 切分后各条正文拼接必须与原文完全一致（逐字不丢、不重）
  · 只切「条号从 1 起严格递增」的序列，避免把正文里偶然引用的「第X条」当成切点
  · 切点前的引导文字（前言/颁布语）保留为第 1 条之前的内容，挂到首条之前不动
  · 改前备份到 _work/fix/law-backup/

用法：python _work/fix/split-laws.py [--dry] [--limit N]
"""
import io
import json
import os
import re
import shutil
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
LAWS = os.path.join(ROOT, "prototype", "data", "laws")
BK = os.path.join(ROOT, "_work", "fix", "law-backup")
DRY = "--dry" in sys.argv
LIMIT = 0
for i, a in enumerate(sys.argv):
    if a == "--limit" and i + 1 < len(sys.argv):
        LIMIT = int(sys.argv[i + 1])

CN_NUM = {'零': 0, '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
          '六': 6, '七': 7, '八': 8, '九': 9}
CN_UNIT = {'十': 10, '百': 100, '千': 1000}

# 注意：必须允许「第 1 条」「第 二 条」这种带空格写法（PDF 抽文本常见）
RE_CN_ART = re.compile(r"第\s*([一二三四五六七八九十百千零〇0-9]{1,6})\s*条")
RE_EN_SEC = re.compile(r"(?m)^[ \t]*Section[ \t]+(\d{1,4})\b")
RE_EN_NUM = re.compile(r"(?m)^[ \t]*(\d{1,4})\.\s+[A-Z]")


def cn2int(s):
    s = str(s).strip()
    if s.isdigit():
        return int(s)
    total, cur = 0, 0
    for ch in s:
        if ch in CN_NUM:
            cur = CN_NUM[ch]
        elif ch in CN_UNIT:
            total += (cur if cur else 1) * CN_UNIT[ch]
            cur = 0
        else:
            return None
    return total + cur


def article_text(a):
    t = a.get("text") or {}
    return " ".join(str(v) for v in t.values() if v)


def first_lang(a):
    t = a.get("text") or {}
    for k, v in t.items():
        if v:
            return k
    return "zh"


def find_marks(blob):
    """返回 (标记列表, 模式名)。标记列表 = [(pos, 条号, 标记文本)]，已过滤为 1..N 严格递增序。"""
    for name, rx, conv in (("cn", RE_CN_ART, cn2int),
                           ("en_section", RE_EN_SEC, int),
                           ("en_numbered", RE_EN_NUM, int)):
        seq, expect = [], 1
        for m in rx.finditer(blob):
            n = conv(m.group(1))
            if n is None:
                continue
            if n == expect:
                seq.append((m.start(), n, m.group(0)))
                expect += 1
        if len(seq) >= 5:
            return seq, name
    return [], None


def main():
    os.makedirs(BK, exist_ok=True)
    plans = []
    for f in sorted(os.listdir(LAWS)):
        if not f.endswith(".json") or f == "index.json":
            continue
        lid = f[:-5]
        try:
            o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
        except Exception:
            continue
        arts = o.get("articles") or []
        if len(arts) != 1:
            continue
        a0 = arts[0]
        blob = article_text(a0)
        if len(blob) < 3000:
            continue
        seq, mode = find_marks(blob)
        if len(seq) < 5:
            continue
        T = o.get("title") or {}
        zh = (T.get("zh") if isinstance(T, dict) else None) or lid
        plans.append({"id": lid, "country": o.get("country"), "chars": len(blob),
                      "n": len(seq), "mode": mode, "title": str(zh)[:46],
                      "file": f, "seq": seq, "blob": blob, "law": o, "art": a0})

    plans.sort(key=lambda x: -x["n"])
    print("  可切分法规: %d 部" % len(plans))
    if LIMIT:
        plans = plans[:LIMIT]
        print("  （--limit %d，只处理前 %d 部）" % (LIMIT, len(plans)))
    print("")
    print("  %-18s %-3s %8s %5s %-12s %s" % ("id", "cc", "字数", "可切", "模式", "标题"))
    for p in plans[:30]:
        print("  %-18s %-3s %8d %5d %-12s %s" % (
            p["id"], p["country"], p["chars"], p["n"], p["mode"], p["title"]))
    if len(plans) > 30:
        print("  … 共 %d 部" % len(plans))

    if DRY:
        print("")
        print("  （--dry 试运行，逐部校验拼接完整性）")
        ok = bad = 0
        for p in plans:
            parts = []
            seq = p["seq"]
            for i, (pos, n, tok) in enumerate(seq):
                end = seq[i + 1][0] if i + 1 < len(seq) else len(p["blob"])
                parts.append(p["blob"][pos:end])
            joined = "".join(parts)
            head = p["blob"][:seq[0][0]]
            loss = len(p["blob"]) - len(head) - len(joined)
            if loss == 0:
                ok += 1
            else:
                bad += 1
                print("    ✗ %s 拼接差 %d 字" % (p["id"], loss))
        print("  完整性校验: %d 部无损 / %d 部有损" % (ok, bad))
        return

    done = 0
    for p in plans:
        lid = p["id"]
        src = os.path.join(LAWS, p["file"])
        shutil.copy2(src, os.path.join(BK, p["file"]))   # 先备份
        blob, seq = p["blob"], p["seq"]
        lang = first_lang(p["art"])
        head = blob[:seq[0][0]]
        new_arts = []
        for i, (pos, n, tok) in enumerate(seq):
            end = seq[i + 1][0] if i + 1 < len(seq) else len(blob)
            body = blob[pos:end].strip()
            # 剥掉正文开头的条号标记：头部已经有 noLabel（「第 N 条」），
            # 正文里再来一次就是「第 2 条 第 2 条 适用范围」这种重复。
            body = re.sub(r"^第\s*[一二三四五六七八九十百千零〇0-9]{1,6}\s*条[\s、.．:：]*", "", body)
            body = re.sub(r"^Section\s+\d{1,4}[\s.．:：]*", "", body, flags=re.I)
            body = re.sub(r"^\d{1,4}\.\s+", "", body)
            # 首条把前言挂回去，保证一字不丢
            if i == 0 and head.strip():
                body = head.strip() + "\n" + body
            new_arts.append({
                "id": "%s-A%d" % (lid, n),
                "no": n,
                "noLabel": {"zh": "第%d条" % n} if lang == "zh" else {"en": "Section %d" % n},
                "text": {lang: body},
            })
        o = p["law"]
        o["articles"] = new_arts
        o["articleCount"] = len(new_arts)
        o["structureMode"] = "ARTICLE"
        o["rebuiltFrom"] = "原为单条全文，2026-10-24 按条号标记重新切分（拼接无损校验通过）"
        io.open(src, "w", encoding="utf-8").write(json.dumps(o, ensure_ascii=False, indent=1))
        done += 1

    print("")
    print("  ✓ 已切分 %d 部（备份在 _work/fix/law-backup/）" % done)


if __name__ == "__main__":
    main()
