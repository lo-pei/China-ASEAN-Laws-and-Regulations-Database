# -*- coding: utf-8 -*-
"""CALR 交付件构建：docs/*.md -> deliverables/*.docx + deliverables/*.pdf"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import md2docx
import md2html

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
HTML_DIR = os.path.join(ROOT, "_work", "html")
OUT_DIR = os.path.join(ROOT, "deliverables")

JOBS = [
    ("docs/01-技术架构文档.md", "01-技术架构文档", "技术架构文档"),
    ("docs/02-视觉设计规范.md", "02-视觉设计规范", "视觉设计规范"),
    ("docs/03-数据建设方案.md", "03-数据建设方案", "数据建设方案"),
    ("docs/04-演示视频脚本.md", "04-演示视频脚本", "演示视频脚本与答辩PPT大纲"),
    ("docs/05-项目申报书正文.md", "05-项目申报书正文", "项目申报书正文"),
    ("docs/06-全文数据规范.md", "06-全文数据规范", "官方全文数据规范"),
    ("docs/07-官方全文抓取实录.md", "07-官方全文抓取实录", "官方全文抓取实录"),
    ("docs/08-页面改版说明.md", "08-页面改版说明", "页面改版说明"),
    ("docs/09-东盟法律数据入库说明.md", "09-东盟法律数据入库说明", "东盟法律数据入库说明"),
    ("docs/10-首页改版方案.md", "10-首页改版方案", "首页改版方案"),
  ("docs/11-无本地原文清单.md", "11-无本地原文清单", "无本地条文原文清单"),
  # 存储契约（原 提示词/SKILL.md 路径已失效，2026-10-15 修正）
  ("rules/SKILL-条文入库与译文分离规范.md", "SKILL-条文入库与译文分离规范",
   "条文入库与译文分离规范（交付给数据供给 agent 的契约）"),
  # 译本生产契约（2026-10-11 建立，2026-10-15 升 v2.2）
  ("rules/SKILL-多国法律文本译本生产规范.md", "SKILL-多国法律文本译本生产规范",
   "多国法律文本译本生产规范（calr-trans-v2.2，交付给翻译 agent 的契约）"),
  # 治理与实录（原由脚本单独构建，2026-10-15 并入统一清单）
  ("docs/26-两批数据对比与统一存储规范（方案）.md", "26-两批数据对比与统一存储规范", "两批数据对比与统一存储规范"),
  ("docs/27-跨层同法去重与条号重复治理报告.md", "27-跨层同法去重与条号重复治理报告", "跨层同法去重与条号重复治理报告"),
  ("docs/28-项目全面审查报告.md", "28-项目全面审查报告", "项目全面审查报告"),
  ("docs/29-备份与中间产物处置评估.md", "29-备份与中间产物处置评估", "备份与中间产物处置评估"),
  ("docs/30-文莱法规入库实录（2026-10-09）.md", "30-文莱法规入库实录", "文莱法规入库实录"),
  ("docs/31-译文层与缅甸批次入库实录（2026-10-15）.md", "31-译文层与缅甸批次入库实录",
   "译文层建设与缅甸批次入库实录"),
  ("docs/33-AI问答质量提升计划.md", "33-AI问答质量提升计划",
   "AI 问答质量提升计划（实测诊断 / P0-P8 任务 / 阶段一执行结果）"),
  ("docs/32-数据养护与批次记录（2026-10-17）.md", "32-数据养护与批次记录",
   "数据养护与批次记录（PIA 专题入库 / 译文层 255 部 / 条号与 id 修复 / _work 清理）"),
    # 法规标题中译契约（2026-10-17）
    ("rules/SKILL-法规标题中译规范.md", "SKILL-法规标题中译规范",
     "法规标题中译规范（calr-title-zh-v1，交付给翻译 agent 的契约）"),
    ("README.md", "00-项目总览与使用说明", "项目总览与使用说明"),
]


def main():
    os.makedirs(HTML_DIR, exist_ok=True)
    os.makedirs(OUT_DIR, exist_ok=True)
    for rel, base, title in JOBS:
        src = os.path.join(ROOT, rel.replace("/", os.sep))
        if not os.path.exists(src):
            print("SKIP (不存在): " + rel)
            continue
        docx = os.path.join(OUT_DIR, base + ".docx")
        page = os.path.join(HTML_DIR, base + ".html")
        pdf = os.path.join(OUT_DIR, base + ".pdf")

        md2docx.convert(src, docx)
        md2html.convert(src, page, title)

        url = "file:///" + page.replace("\\", "/")
        cmd = [EDGE, "--headless=new", "--disable-gpu", "--no-first-run",
               "--user-data-dir=" + os.path.join(os.environ.get("TEMP", "."), "calr-edge"),
               "--no-pdf-header-footer", "--print-to-pdf=" + pdf, url]
        try:
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=180)
        except Exception as exc:  # noqa
            print("PDF 生成失败: " + base + " -> " + str(exc))
            continue
        print("built: %-22s docx=%4dKB pdf=%4dKB" % (
            base,
            os.path.getsize(docx) // 1024,
            (os.path.getsize(pdf) // 1024) if os.path.exists(pdf) else -1))


if __name__ == "__main__":
    main()
