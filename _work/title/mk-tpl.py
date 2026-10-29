# -*- coding: utf-8 -*-
import io, json, os
# 回执模板
recv = {
  "jobId": "CALR-TITLE-<时间戳>-<范围>-<条数>",
  "engine": "llm",
  "model": "<你的模型名>",
  "generatedAt": "2026-10-17T18:00:00+08:00",
  "counts": {"requested": 150, "translated": 150, "skipped": 0},
  "shards": ["titles.001.json"],
  "selfCheck": {
    "allIdsReturned": True, "noExtraIds": True, "noDuplicateIds": True,
    "allNonEmpty": True, "noSourceCopies": True, "noInventedNames": True,
    "noBoilerplate": True, "jsonValid": True
  }
}
io.open("_work/title/templates/return-receipt.template.json", "w", encoding="utf-8").write(
    json.dumps(recv, ensure_ascii=False, indent=1))
shard = {
  "jobId": "CALR-TITLE-<时间戳>-<范围>-<条数>",
  "shard": 1,
  "items": [
    {"id": "SG-H3637", "zh": "证券与期货法 2001"},
    {"id": "SG-H004", "zh": "公司法 1967"},
    {"id": "BN-CAP-39-2015-COMPANIES-ACT", "zh": "公司法"}
  ]
}
io.open("_work/title/templates/return-shard.template.json", "w", encoding="utf-8").write(
    json.dumps(shard, ensure_ascii=False, indent=1))
print("  ✓ 已写 2 个回执模板")
# 纳入交付件构建
p = "_work/build_docs.py"
s = io.open(p, encoding="utf-8").read()
anchor = '''    ("README.md", "00-项目总览与使用说明", "项目总览与使用说明"),'''
new = '''    # 法规标题中译契约（2026-10-17）
    ("rules/SKILL-法规标题中译规范.md", "SKILL-法规标题中译规范",
     "法规标题中译规范（calr-title-zh-v1，交付给翻译 agent 的契约）"),
''' + anchor
if "SKILL-法规标题中译规范" not in s:
    s = s.replace(anchor, new, 1)
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ build_docs.py 已纳入标题中译 SKILL")
else:
    print("  - 已存在")
