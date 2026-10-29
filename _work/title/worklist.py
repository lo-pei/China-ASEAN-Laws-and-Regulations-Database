# -*- coding: utf-8 -*-
import io, os, json, glob, re, sys
sys.stdout.reconfigure(encoding="utf-8")
# 概念优先级（分数越高越先译）
PRI = [
    (r"\b(personal data|data protection|privacy|personal information)\b", 100, "数据/隐私"),
    (r"\b(artificial intelligence|cyber|electronic transaction|electronic commerce|digital)\b", 92, "数字/AI"),
    (r"\b(competition|anti-?trust|consumer protection)\b", 88, "竞争/消保"),
    (r"\b(intellectual property|copyright|patent|trademark|geographical indication)\b", 86, "知识产权"),
    (r"\b(company|companies|corporation|partnership|business trust|limited liability)\b", 84, "公司/企业"),
    (r"\b(investment|foreign investment|free trade|special economic)\b", 82, "投资/经贸"),
    (r"\b(labou?r|employment|workplace|wage|industrial relations|trade union)\b", 80, "劳动"),
    (r"\b(arbitration|mediation|dispute resolution|conciliation)\b", 78, "争议解决"),
    (r"\b(insolvency|bankruptcy|winding up|liquidation|reorganization)\b", 76, "破产"),
    (r"\b(banking|financial|insurance|securities|capital market|payment system|money laundering)\b", 74, "金融"),
    (r"\b(tax|taxation|income tax|goods and services tax|stamp duty|revenue)\b", 72, "税务"),
    (r"\b(contract|sale of goods|agency|guarantee|security interest)\b", 68, "合同/商事"),
    (r"\b(criminal|penal|offence|corruption|bribery|evidence|procedure|court|judiciary)\b", 64, "刑事/程序"),
    (r"\b(environment|climate|carbon|pollution|waste|energy|mining|forest|wildlife)\b", 60, "环境/能源"),
    (r"\b(health|pharmaceutical|medical|food safety|disease)\b", 56, "卫生"),
    (r"\b(education|university|school|training|qualification)\b", 50, "教育"),
    (r"\b(immigration|citizenship|passport|migration|employment pass|work pass)\b", 48, "移民"),
    (r"\b(shipping|maritime|aviation|air transport|carriage|port|harbour)\b", 46, "海空运输"),
    (r"\b(land|property|real estate|conveyancing|registration of title|mortgage)\b", 44, "土地/房产"),
    (r"\b(agriculture|fisheries|plantation|livestock|food)\b", 40, "农林渔"),
]
rows = []
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f) == "index.json": continue
    try: o = json.load(io.open(f, encoding="utf-8"))
    except: continue
    t = o.get("title") or {}
    if t.get("zh"): continue
    src = t.get("en")
    if not src or re.search(r"[\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff]", src): continue
    best = 0; tags = []
    for pat, sc, tag in PRI:
        if re.search(pat, src, re.I):
            best = max(best, sc); tags.append(tag)
    if best <= 0: continue
    rows.append({"id": o["id"], "country": o.get("country"), "src": src.strip(),
                 "articles": len(o.get("articles") or []), "score": best, "tags": tags})
rows.sort(key=lambda r: (-r["score"], -r["articles"], r["id"]))
print("  命中核心概念的标题：%d 条" % len(rows))
print("")
from collections import Counter
print("  按概念分布：")
tc = Counter()
for r in rows:
    for t in r["tags"]: tc[t] += 1
for t, n in tc.most_common():
    print("    %-14s %4d" % (t, n))
print("")
print("  按国别：")
for c, n in Counter(r["country"] for r in rows).most_common():
    print("    %-4s %4d" % (c, n))
print("")
print("  分数 ≥84（前四档）共 %d 条" % sum(1 for r in rows if r["score"] >= 84))
print("  分数 ≥76 共 %d 条" % sum(1 for r in rows if r["score"] >= 76))
print("  分数 ≥64 共 %d 条" % sum(1 for r in rows if r["score"] >= 64))
os.makedirs("_work/title/out", exist_ok=True)
json.dump(rows, io.open("_work/title/worklist.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("")
print("  已写 _work/title/worklist.json")
print("")
print("=== 最高优先级前 40 条 ===")
for i, r in enumerate(rows[:40], 1):
    print("  %2d) [%-4s %2d条] %s" % (i, r["country"], r["articles"], r["src"][:90]))
