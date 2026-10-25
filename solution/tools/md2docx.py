# -*- coding: utf-8 -*-
"""
Markdown -> DOCX 转换器（为 CALR 项目定制）
支持：标题、段落、加粗/斜体/行内代码、链接、代码块（含 mermaid）、表格、
      无序/有序列表、引用块、分隔线、任务列表。
用法：python md2docx.py <input.md> <output.docx> ["标题"]
"""
import re
import sys
import os

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

FONT_LATIN = "Segoe UI"
FONT_EA = "微软雅黑"
FONT_CODE = "Consolas"
BRAND_NAVY = RGBColor(0x1B, 0x3A, 0x5C)
BRAND_BLUE = RGBColor(0x2B, 0x6C, 0xB0)
GRAY = RGBColor(0x4A, 0x55, 0x68)


def set_run_font(run, latin=FONT_LATIN, ea=FONT_EA, size=None, bold=None,
                 italic=None, color=None, mono=False):
    if mono:
        latin, ea = FONT_CODE, FONT_CODE
    run.font.name = latin
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.append(rFonts)
    rFonts.set(qn('w:ascii'), latin)
    rFonts.set(qn('w:hAnsi'), latin)
    rFonts.set(qn('w:eastAsia'), ea)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic
    if color is not None:
        run.font.color.rgb = color


def shade(el, fill):
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill)
    el.append(shd)


def para_shade(paragraph, fill):
    shade(paragraph._element.get_or_add_pPr(), fill)


def set_cell_bg(cell, fill):
    shade(cell._tc.get_or_add_tcPr(), fill)


def add_bottom_border(paragraph, color="2B6CB0", size=6):
    pPr = paragraph._element.get_or_add_pPr()
    borders = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), str(size))
    bottom.set(qn('w:space'), '1')
    bottom.set(qn('w:color'), color)
    borders.append(bottom)
    pPr.append(borders)


INLINE_RE = re.compile(
    r'(\*\*\*.+?\*\*\*|\*\*.+?\*\*|__.+?__|`[^`]+`|\*[^*\n]+?\*|\[[^\]]+\]\([^)]+\))'
)


def add_inline(paragraph, text, size=10.5, base_bold=False, color=None):
    """把含行内标记的文本写入段落"""
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)  # 图片丢弃（离线文档不放外链图）
    # 只剔除「已知 HTML 标签」，不能把任意 <...> 都当标签删掉——
    # 契约类文档里有大量形如 <lawId>、<sourceLang>、<JOBID> 的占位符，
    # 早期写法 re.sub(r'<[^>]+>', '', text) 会把它们整段吃掉，导致句子失去主语。
    text = re.sub(r'</?(?:br|hr|sub|sup|span|div|p|b|i|em|strong|code|pre|table|tr|td|th)\s*/?>',
                  '', text, flags=re.I)
    for part in INLINE_RE.split(text):
        if not part:
            continue
        if part.startswith('***') and part.endswith('***') and len(part) > 6:
            run = paragraph.add_run(part[3:-3])
            set_run_font(run, size=size, bold=True, italic=True, color=color)
        elif part.startswith('**') and part.endswith('**') and len(part) > 4:
            run = paragraph.add_run(part[2:-2])
            set_run_font(run, size=size, bold=True, color=color)
        elif part.startswith('__') and part.endswith('__') and len(part) > 4:
            run = paragraph.add_run(part[2:-2])
            set_run_font(run, size=size, bold=True, color=color)
        elif part.startswith('`') and part.endswith('`') and len(part) > 2:
            run = paragraph.add_run(part[1:-1])
            set_run_font(run, size=size - 0.5, mono=True, color=RGBColor(0xB0, 0x30, 0x60))
        elif part.startswith('*') and part.endswith('*') and len(part) > 2:
            run = paragraph.add_run(part[1:-1])
            set_run_font(run, size=size, italic=True, color=color)
        elif part.startswith('[') and '](' in part:
            m = re.match(r'\[([^\]]+)\]\(([^)]+)\)', part)
            label, url = (m.group(1), m.group(2)) if m else (part, '')
            run = paragraph.add_run(label)
            set_run_font(run, size=size, color=BRAND_BLUE)
            run.underline = True
            if url and url != label:
                r2 = paragraph.add_run(' (' + url + ')')
                set_run_font(r2, size=size - 1, color=GRAY)
        else:
            run = paragraph.add_run(part)
            set_run_font(run, size=size, bold=base_bold, color=color)


def parse_table(lines, i):
    header = [c.strip() for c in lines[i].strip().strip('|').split('|')]
    aligns = [c.strip() for c in lines[i + 1].strip().strip('|').split('|')]
    rows = []
    j = i + 2
    while j < len(lines) and lines[j].strip().startswith('|'):
        rows.append([c.strip() for c in lines[j].strip().strip('|').split('|')])
        j += 1
    return header, aligns, rows, j


def add_table(doc, header, aligns, rows):
    ncols = max([len(header)] + [len(r) for r in rows]) if rows else len(header)
    table = doc.add_table(rows=1, cols=ncols)
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True

    # 表格宽度固定为页面内容宽度的 100%，并允许自动换行（避免右侧溢出页面）
    tblPr = table._tbl.tblPr
    for tag in ('w:tblW', 'w:tblLayout'):
        old = tblPr.find(qn(tag))
        if old is not None:
            tblPr.remove(old)
    tblW = OxmlElement('w:tblW')
    tblW.set(qn('w:w'), '5000')
    tblW.set(qn('w:type'), 'pct')
    tblPr.append(tblW)
    layout = OxmlElement('w:tblLayout')
    layout.set(qn('w:type'), 'autofit')
    tblPr.append(layout)

    hdr = table.rows[0].cells
    for k in range(ncols):
        cell = hdr[k]
        cell.text = ''
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        add_inline(p, header[k] if k < len(header) else '', size=9, base_bold=True,
                   color=RGBColor(0x1B, 0x3A, 0x5C))
        set_cell_bg(cell, 'EBF4FF')

    for r in rows:
        cells = table.add_row().cells
        for k in range(ncols):
            cell = cells[k]
            cell.text = ''
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            txt = r[k] if k < len(r) else ''
            txt = txt.replace('<br>', '\n').replace('<br/>', '\n')
            add_inline(p, txt, size=8.5)
    return table


def convert(md_path, docx_path, title=None):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.read().replace('\r\n', '\n').split('\n')

    doc = Document()
    sec = doc.sections[0]
    sec.page_width = Cm(21.0)
    sec.page_height = Cm(29.7)
    sec.top_margin = Cm(2.4)
    sec.bottom_margin = Cm(2.2)
    sec.left_margin = Cm(2.2)
    sec.right_margin = Cm(2.2)

    normal = doc.styles['Normal']
    normal.font.size = Pt(10.5)
    normal.font.name = FONT_LATIN
    normal.element.rPr.rFonts.set(qn('w:eastAsia'), FONT_EA)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.35

    for sname, sz in (('Heading 1', 18), ('Heading 2', 15), ('Heading 3', 13), ('Heading 4', 11.5)):
        st = doc.styles[sname]
        st.font.name = FONT_LATIN
        st.font.size = Pt(sz)
        st.font.color.rgb = BRAND_NAVY
        st.font.bold = True
        st.element.rPr.rFonts.set(qn('w:eastAsia'), FONT_EA)

    i = 0
    in_front = False
    n = len(lines)
    while i < n:
        raw = lines[i]
        line = raw.rstrip()
        stripped = line.strip()

        # YAML front matter
        if i == 0 and stripped == '---':
            in_front = True
            i += 1
            continue
        if in_front:
            if stripped == '---':
                in_front = False
            i += 1
            continue

        # 代码块
        if stripped.startswith('```'):
            lang = stripped[3:].strip()
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith('```'):
                buf.append(lines[i])
                i += 1
            i += 1
            if lang.lower() in ('mermaid', 'text', '') or lang:
                if lang.lower() == 'mermaid':
                    cap = doc.add_paragraph()
                    add_inline(cap, '［图：Mermaid 图表源码（%d 行）——请在 Markdown/Mermaid 渲染环境中查看图形］' % len(buf), size=9, color=GRAY)
                p = doc.add_paragraph()
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(8)
                p.paragraph_format.line_spacing = 1.0
                for k, b in enumerate(buf):
                    if k:
                        p.add_run('\n')
                    run = p.add_run(b if b else ' ')
                    set_run_font(run, size=8, mono=True, color=RGBColor(0x2D, 0x37, 0x48))
                para_shade(p, 'F5F7FA')
            continue

        # 表格
        if stripped.startswith('|') and i + 1 < n and re.match(r'^\|[\s:\-|]+\|$', lines[i + 1].strip()):
            header, aligns, rows, j = parse_table(lines, i)
            add_table(doc, header, aligns, rows)
            i = j
            doc.add_paragraph()
            continue

        # 分隔线
        if re.match(r'^(-{3,}|\*{3,}|_{3,})$', stripped):
            p = doc.add_paragraph()
            add_bottom_border(p, 'CBD5E0', 6)
            i += 1
            continue

        # 标题
        m = re.match(r'^(#{1,6})\s+(.*)$', stripped)
        if m:
            level = min(len(m.group(1)), 4)
            text = re.sub(r'\s*#+\s*$', '', m.group(2))
            h = doc.add_heading('', level=level)
            add_inline(h, text, size={1: 18, 2: 15, 3: 13, 4: 11.5}[level])
            for run in h.runs:
                run.bold = True
                run.font.color.rgb = BRAND_NAVY
            if level == 1:
                add_bottom_border(h, '1B3A5C', 8)
            i += 1
            continue

        # 引用
        if stripped.startswith('>'):
            buf = []
            while i < n and lines[i].strip().startswith('>'):
                buf.append(lines[i].strip()[1:].strip())
                i += 1
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(0.6)
            add_inline(p, '\n'.join(buf), size=10, color=GRAY)
            para_shade(p, 'F7FAFC')
            continue

        # 列表
        m = re.match(r'^(\s*)([-*+]|\d+[.)])\s+(.*)$', line)
        if m:
            indent = len(m.group(1)) // 2
            ordered = bool(re.match(r'\d+', m.group(2)))
            text = m.group(3)
            style = 'List Number' if ordered else 'List Bullet'
            if indent > 0:
                style = 'List Bullet 2'
            p = doc.add_paragraph(style=style)
            p.paragraph_format.space_after = Pt(2)
            task = re.match(r'^\[( |x|X)\]\s+(.*)$', text)
            if task:
                text = ('☑ ' if task.group(1).lower() == 'x' else '☐ ') + task.group(2)
            add_inline(p, text, size=10.5)
            i += 1
            continue

        # 空行
        if not stripped:
            i += 1
            continue

        # 普通段落（合并连续行）
        buf = [stripped]
        i += 1
        while i < n and lines[i].strip() and not re.match(r'^(#{1,6}\s|\||>|```|\s*([-*+]|\d+[.)])\s)', lines[i].strip()):
            buf.append(lines[i].strip())
            i += 1
        p = doc.add_paragraph()
        add_inline(p, ' '.join(buf), size=10.5)

    doc.save(docx_path)
    return docx_path


if __name__ == '__main__':
    src = sys.argv[1]
    dst = sys.argv[2]
    convert(src, dst)
    print('OK ' + dst + ' (' + str(os.path.getsize(dst)) + ' bytes)')
