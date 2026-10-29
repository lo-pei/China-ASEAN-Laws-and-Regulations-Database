import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
css = io.open(os.path.join(os.getcwd(), "prototype/assets/css/views.css"), encoding="utf-8").read()
print("  两端对齐在备份里: %s" % ("有" if "text-align: justify" in css else "无（需重新加）"))
print("  .article__cite 在备份里: %d 次" % css.count(".article__cite"))
js = io.open(os.path.join(os.getcwd(), "prototype/assets/js/views/law.js"), encoding="utf-8").read()
print("  article__cite 在 law.js 备份里: %d 次" % js.count("article__cite"))
