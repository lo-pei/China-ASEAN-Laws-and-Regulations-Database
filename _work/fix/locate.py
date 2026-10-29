import io, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
js = io.open(os.path.join(os.getcwd(), "prototype/assets/js/views/law.js"), encoding="utf-8").read()
L = js.split("\n")
print("=== 按钮 HTML 位置 ===")
for i, ln in enumerate(L):
    if "article__cite" in ln:
        for j in range(max(0, i-2), min(len(L), i+5)):
            print("  L%-4d %s" % (j+1, L[j].rstrip()[:120]))
        break
print()
print("=== 事件绑定位置 ===")
for i, ln in enumerate(L):
    if "data-article-cite" in ln and "getAttribute" in ln:
        for j in range(max(0, i-8), min(len(L), i+14)):
            print("  L%-4d %s" % (j+1, L[j].rstrip()[:120]))
        break
