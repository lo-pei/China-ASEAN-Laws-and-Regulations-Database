import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
js = io.open(os.path.join(os.getcwd(), "prototype/assets/js/views/law.js"), encoding="utf-8").read()
print("  article__cite 残留: %d" % js.count("article__cite"))
print("  data-article-cite 残留: %d" % js.count("data-article-cite"))
print("  citeOf 仍在: %s" % ("✓" if "function citeOf" in js else "✗"))
print("  法规级引用卡片仍在: %s" % ("✓" if "copy-cite2" in js else "✗"))
# CSS 加两端对齐（备份里没有，需重新加，且不含按钮样式）
cssp = os.path.join(os.getcwd(), "prototype/assets/css/views.css")
css = io.open(cssp, encoding="utf-8").read()
if "text-align: justify" not in css:
    css = css.rstrip() + """

/* 条文正文两端对齐（原来默认左对齐，右侧参差不齐） */
.article__p {
  text-align: justify;
  text-justify: inter-ideograph;
  word-break: break-word;
}
"""
    io.open(cssp, "w", encoding="utf-8").write(css)
    print("  ✓ views.css 已加两端对齐（无按钮样式）")
else:
    print("  - 两端对齐已存在")
print("  .article__cite 在 CSS: %d 次" % css.count(".article__cite"))
