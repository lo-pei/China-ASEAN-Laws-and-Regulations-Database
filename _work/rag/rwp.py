# -*- coding: utf-8 -*-
import io, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
s = io.open("prototype/assets/js/core/qa.js", encoding="utf-8").read()
L = s.split("\n")
i = next(k for k,ln in enumerate(L) if "function retrieveWithPacks" in ln)
print("=== retrieveWithPacks (L%d) ===" % (i+1))
for j in range(i, min(len(L), i+45)):
    print("  L%-4d %s" % (j+1, L[j].rstrip()[:130]))
print()
# 看 assistant.js 怎么用它
a = io.open("prototype/assets/js/views/assistant.js", encoding="utf-8").read()
for m in re.finditer(r".{0,60}retrieveWithPacks.{0,140}", a):
    print("  assistant: " + m.group(0).replace("\n"," ")[:200])
