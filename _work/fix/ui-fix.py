# -*- coding: utf-8 -*-
"""
① 重新设计条文引用按钮
   现状：每条条文头部都有一个常驻的「引用」文字按钮，且**完全没有 CSS**，
        浏览器用默认按钮样式渲染（灰底凸起），非常难看；
        而且 1,260 条的民法典里每条旁边都有一个，视觉噪音极大。

   改为：默认隐藏，鼠标移到条文头部时才出现一个 12px 的复制小图标；
        点击复制「法规 + 第 X 条」粒度引注。
        法规级的「复制本法规引用格式」卡片保持不变（那是主入口）。

③ 条文正文两端对齐 + 修复 PDF/OCR 造成的断行
   · .article__p 加 text-align: justify
   · util.paragraphs() 增加「智能合并断行」：PDF 抽出的文本常在句子中间插 \n，
     导致一句话被拆成好几段；当上一行不以句末标点结尾、且下一行不是新条目开头时，
     把两行合并。
"""
import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()

# ============================================================ ① 按钮
print("=== ① 条文引用按钮 ===")
P_LAW = os.path.join(ROOT, "prototype/assets/js/views/law.js")
s = io.open(P_LAW, encoding="utf-8").read()
o = s

# 按钮内容从文字「引用」改成复用图标，并加 aria-label 保证可访问性
s = s.replace(
    """        '<button class="article__cite" type="button" data-article-cite="' + esc(a.id) + '" title="' +
          esc(t('复制本条引用')) + '">' + esc(t('引用')) + '</button>' +""",
    """        '<button class="article__cite" type="button" data-article-cite="' + esc(a.id) + '"' +
          ' title="' + esc(t('复制本条引用')) + '" aria-label="' + esc(t('复制本条引用')) + '">' +
          CALR.ui.icon('copy') + '</button>' +""")

if s != o:
    io.open(P_LAW, "w", encoding="utf-8").write(s)
    print("  ✓ 按钮改为图标形式")
else:
    print("  ! 按钮锚点未命中")

# CSS
P_CSS = os.path.join(ROOT, "prototype/assets/css/views.css")
css = io.open(P_CSS, encoding="utf-8").read()
CSS_ADD = """
/* ---------- 条文引用按钮（重设计） ----------
   原来每条条文头都常驻一个「引用」文字按钮且没有样式，浏览器用默认样式渲染，
   视觉噪音很大。改为：默认隐藏，hover/键盘聚焦时才浮出一个 12px 复制图标。 */
.article__cite {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 6px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--text-tertiary, #9AA4B2);
  cursor: pointer;
  opacity: 0;
  transition: opacity .14s ease, background-color .14s ease, color .14s ease;
  vertical-align: middle;
}
.article__cite svg,
.article__cite i {
  width: 13px;
  height: 13px;
}
.article__head:hover .article__cite,
.article__cite:focus-visible {
  opacity: 1;
}
.article__cite:hover {
  background: var(--bg-subtle, #F1F3F7);
  color: var(--calr-blue-600, #2563EB);
}
/* 触屏设备没有 hover，直接常显，避免点不到 */
@media (hover: none) {
  .article__cite { opacity: .55; }
}

/* 条文正文两端对齐（原来默认左对齐，右侧参差不齐） */
.article__p {
  text-align: justify;
  text-justify: inter-ideograph;
  word-break: break-word;
}
"""
if ".article__cite {" not in css:
    css = css.rstrip() + "\n" + CSS_ADD
    io.open(P_CSS, "w", encoding="utf-8").write(css)
    print("  ✓ views.css 已加按钮样式与两端对齐")
else:
    print("  ! views.css 已存在 .article__cite，跳过")

# ============================================================ ③ 断行
print("")
print("=== ③ 智能合并 PDF 断行 ===")
P_UTIL = os.path.join(ROOT, "prototype/assets/js/core/util.js")
u = io.open(P_UTIL, encoding="utf-8").read()
o2 = u

m = re.search(r"util\.paragraphs\s*=\s*function\s*\(text\)\s*\{.*?\n  \};", u, re.S)
if not m:
    print("  ! 找不到 util.paragraphs")
else:
    old = m.group(0)
    new = r"""util.paragraphs = function (text) {
    var raw = String(text == null ? '' : text).split(/\r?\n/);
    /* 智能合并 PDF/OCR 断行：
       PDF 抽出的文本常在句子中间插入换行，直接按 \n 切会把一句话拆成好几段，
       渲染出来就是「一行一句、参差不齐」。
       规则：若上一行不以句末标点收尾，且下一行不是新条目（编号 / 第X条 / 括号项 /
       项目符号），则把下一行接上去。真正的段落分隔（上一行以句号结尾）不受影响。 */
    var END_PUNCT = /[。！？；：!?;:：”』」）)\]]\s*$/;
    var NEW_ITEM = /^\s*(第[一二三四五六七八九十百千0-9]+[条章节款项]|[（(][一二三四五六七八九十0-9]+[）)]|[0-9]+[.、．)]|[①-⑳]|[一二三四五六七八九十]+、|[-—*·•]\s)/;
    var merged = [];
    for (var i = 0; i < raw.length; i++) {
      var line = raw[i];
      var t = String(line == null ? '' : line);
      if (!t.trim()) { merged.push(''); continue; }
      if (merged.length) {
        var prevIdx = merged.length - 1;
        var prev = merged[prevIdx];
        if (prev && prev.trim() && !END_PUNCT.test(prev) && !NEW_ITEM.test(t)) {
          /* 英文行尾是连字符时去掉连字符再拼；中文直接拼 */
          if (/[A-Za-z]-$/.test(prev.trim())) {
            merged[prevIdx] = prev.trim().slice(0, -1) + t.trim();
          } else {
            merged[prevIdx] = prev + t;
          }
          continue;
        }
      }
      merged.push(t);
    }
    return merged
      .map(function (x) { return String(x).trim(); })
      .filter(function (x) { return x.length > 0; });
  };"""
    u = u.replace(old, new, 1)
    io.open(P_UTIL, "w", encoding="utf-8").write(u)
    print("  ✓ util.paragraphs 已加智能断行合并")

print("")
print("  完成")
