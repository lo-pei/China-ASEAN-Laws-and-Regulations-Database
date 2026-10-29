# -*- coding: utf-8 -*-
r"""定位 _work 中用户产出的「法规标题译文」文件"""
import io, os, json, glob, re, sys, time
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

print("=== 一、_work/title 全部内容 ===")
for root, dirs, files in os.walk("_work/title"):
    rel = root.replace("\\", "/")
    for f in sorted(files):
        p = os.path.join(root, f)
        st = os.stat(p)
        print("  %-62s %9.1f KB  %s" % (rel + "/" + f, st.st_size / 1024,
              time.strftime("%m-%d %H:%M", time.localtime(st.st_mtime))))

print()
print("=== 二、_work 下最近 48 小时新增/改动的 JSON/JS/CSV ===")
cut = time.time() - 48 * 3600
rows = []
for root, dirs, files in os.walk("_work"):
    for f in files:
        if not f.lower().endswith((".json", ".js", ".csv", ".tsv", ".txt", ".md")):
            continue
        p = os.path.join(root, f)
        try:
            st = os.stat(p)
        except OSError:
            continue
        if st.st_mtime >= cut:
            rows.append((st.st_mtime, st.st_size, p.replace("\\", "/")))
rows.sort(reverse=True)
for mt, sz, p in rows[:40]:
    print("  %-64s %9.1f KB  %s" % (p, sz / 1024, time.strftime("%m-%d %H:%M", time.localtime(mt))))

print()
print("=== 三、内容特征扫描：含 lawId + 中文标题 的 JSON ===")
LAWID = re.compile(r"\b(PH|SG|BN|TH|MY|KH|LA|MM|ID|VN|TL|CN)-[A-Z0-9\-]{3,}")
CJK = re.compile(r"[\u4e00-\u9fff]")
cands = []
for root, dirs, files in os.walk("_work"):
    for f in files:
        if not f.lower().endswith(".json"):
            continue
        p = os.path.join(root, f)
        try:
            if os.path.getsize(p) > 30 * 1024 * 1024:
                continue
            head = io.open(p, encoding="utf-8", errors="ignore").read(200000)
        except Exception:
            continue
        if LAWID.search(head) and CJK.search(head):
            # 判断是否像「标题映射」
            score = 0
            if '"zh"' in head: score += 1
            if '"id"' in head: score += 1
            if re.search(r'"(title|en|source|zh)"', head): score += 1
            cands.append((os.path.getsize(p), p.replace("\\", "/"), score))
cands.sort(reverse=True)
for sz, p, sc in cands[:30]:
    print("  score=%d  %-62s %9.1f KB" % (sc, p, sz / 1024))
