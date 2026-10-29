# -*- coding: utf-8 -*-
"""往返测试：export → 构造回执 → verify → ingest(dry)
   同时验证校验器能抓住 9 类典型错误"""
import io, os, json, subprocess, sys, tempfile, shutil, glob
sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.abspath(".")
NODE = sys.executable  # 占位，实际用下面的 node
NODE = r"C:\Users\lenovo\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"

def run(args, expect=0):
    r = subprocess.run([NODE] + args, capture_output=True, cwd=ROOT)
    out = (r.stdout or b"").decode("utf-8", "replace")
    err = (r.stderr or b"").decode("utf-8", "replace")
    return r.returncode, out, err

print("=== 1) 导出任务包（新加坡 8 条）===")
code, out, err = run(["_work/title/export-title-batch.js", "--country", "SG", "--count", "8"])
print(out.strip()[:600])
if code != 0:
    print(err); raise SystemExit(1)
jobs = sorted(glob.glob("_work/title/jobs/CALR-TITLE-*"))
JOB = jobs[-1]
print("  任务包: " + JOB)
man = json.load(io.open(os.path.join(JOB, "manifest.json"), encoding="utf-8"))
titles = json.load(io.open(os.path.join(JOB, "titles.json"), encoding="utf-8"))
print("  jobId=%s count=%d" % (man["jobId"], man["count"]))

# ---- 构造一个「正确」回执 ----
RET = "_work/title/_test_return_ok"
shutil.rmtree(RET, ignore_errors=True)
os.makedirs(RET)
FAKE = ["竞争法 2004", "竞争条例 2007", "竞争（上诉）条例", "消费者保护（安全要求）条例",
        "消费者保护（符合性评估）条例 2025", "著作权条例 2021", "公司条例", "合伙法 1890"]
items = [{"id": t["id"], "zh": FAKE[i % len(FAKE)]} for i, t in enumerate(titles)]
json.dump({"jobId": man["jobId"], "shard": 1, "items": items},
          io.open(os.path.join(RET, "titles.001.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
json.dump({"jobId": man["jobId"], "engine": "llm", "model": "test-model",
           "counts": {"requested": len(titles), "translated": len(items), "skipped": 0},
           "shards": ["titles.001.json"]},
          io.open(os.path.join(RET, "receipt.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)

print("")
print("=== 2) 校验正确回执（应通过）===")
code, out, err = run(["tools/verify-title-return.js", RET, "--job", JOB])
print(out.strip()[-500:])
print("  退出码=%d（期望 0）" % code)

print("")
print("=== 3) 错误回执应被抓住（9 类）===")
cases = {
    "漏条":        lambda its: its[:-2],
    "id 不存在":    lambda its: its + [{"id": "NOPE-999", "zh": "不存在的法"}],
    "重复 id":      lambda its: its + [its[0]],
    "zh 为空":      lambda its: [dict(its[0], zh="")] + its[1:],
    "照抄原文":      lambda its: [dict(its[0], zh=titles[0]["en"])] + its[1:],
    "全英文":       lambda its: [dict(its[0], zh="Competition Act 2004")] + its[1:],
    "编造公司名":     lambda its: [dict(its[0], zh="关于授予 FakeCorp 特许经营权的法案")] + its[1:],
    "含免责套话":     lambda its: [dict(its[0], zh="竞争法（仅供参考）")] + its[1:],
    "过长":        lambda its: [dict(its[0], zh="关" * 120)] + its[1:],
}
for name, mut in cases.items():
    d = "_work/title/_test_return_bad"
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    bad = mut([dict(x) for x in items])
    json.dump({"jobId": man["jobId"], "shard": 1, "items": bad},
              io.open(os.path.join(d, "titles.001.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    json.dump({"jobId": man["jobId"], "engine": "llm", "model": "t",
               "counts": {"requested": len(titles), "translated": len(bad), "skipped": 0}},
              io.open(os.path.join(d, "receipt.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    code, out, err = run(["tools/verify-title-return.js", d, "--job", JOB])
    caught = (code != 0)
    first = ""
    for ln in out.split("\n"):
        if ln.strip().startswith("- R"):
            first = ln.strip(); break
    print("  %-12s 退出码=%d  %s  %s" % (name, code, "✓ 抓住" if caught else "✗ 漏过", first[:70]))

print("")
print("=== 4) 入库（dry，不写盘）===")
code, out, err = run(["_work/title/ingest-titles.js", RET, "--job", JOB, "--dry"])
print(out.strip()[-700:])
print("  退出码=%d（期望 0）" % code)

shutil.rmtree(RET, ignore_errors=True)
shutil.rmtree("_work/title/_test_return_bad", ignore_errors=True)
print("")
print("  测试产物已清理")
