import io
p = "_work/title/worklist.py"
s = io.open(p, encoding="utf-8").read()
s = s.replace(r"[\u0e00-\u7f\u1000-\u109f\u1780-\u17ff]", r"[\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff]")
io.open(p, "w", encoding="utf-8").write(s)
print("  已修正正则字符类")
