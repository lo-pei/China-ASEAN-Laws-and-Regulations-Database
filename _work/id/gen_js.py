# -*- coding: utf-8 -*-
"""
生成 prototype/data/fulltext/id.js（最终版）
纳入法规：8 部（其余 4 部因正文源不完整/OCR 不可用，列入“未获取”）
数据源：pasal.id 逐条转录页（逐字）＋ 官方 JDIHN/BPK PDF 副本补录与核校
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FINAL = os.path.join(HERE, "final2")
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
DEST = os.path.join(ROOT, "prototype", "data", "fulltext", "id.js")
CORE = json.load(open(os.path.join(HERE, "core_meta.json"), encoding="utf-8"))
FETCHED_AT = "2026-10-02"

SRC_OFFICIAL = ("Jaringan Dokumentasi dan Informasi Hukum (JDIH) / peraturan.go.id 与 JDIH BPK "
                "官方 PDF 副本核校；条文转录页：pasal.id")

CONF = {
    "ID-INVEST-2007": dict(
        official="https://peraturan.go.id/id/uu-no-25-tahun-2007",
        pdf="https://peraturan.bpk.go.id/Download/29494/UU%20Nomor%2025%20Tahun%202007.pdf",
        slug="uu/uu-no-25-tahun-2007",
        note="全文：Pasal 1–Pasal 40（含官方 Penjelasan，存于各条 penjelasan 字段）；"
             "LN 2007 No. 67, TLN No. 4724。Pasal 1、8、22、23、37 因转录站网页懒加载未渲染，"
             "直接取自官方 PDF 文本。2020 年第 11 号《创造就业法》曾修改本法部分条款，本文件按 2007 年颁布原文录入。"),
    "ID-COMPANY-2007": dict(
        official="https://peraturan.go.id/id/uu-no-40-tahun-2007",
        pdf="https://peraturan.bpk.go.id/Download/29563/UU%20Nomor%2040%20Tahun%202007.pdf",
        slug="uu/uu-no-40-tahun-2007",
        note="全文：Pasal 1–Pasal 161（含官方 Penjelasan）；LN 2007 No. 106, TLN No. 4756。"
             "共 50 条因转录站懒加载未渲染，取自官方 PDF 文本（另见各条 source）。"
             "2020 年第 11 号《创造就业法》曾修改本法部分条款，本文件按 2007 年颁布原文录入。"),
    "ID-LABOR-2003": dict(
        official="https://peraturan.go.id/id/uu-no-13-tahun-2003",
        pdf="https://peraturan.go.id/files/UU+13-2003.pdf",
        slug="uu/uu-no-13-tahun-2003",
        note="全文：Pasal 1–Pasal 193（含官方 Penjelasan）；LN 2003 No. 39, TLN No. 4279。"
             "共 74 条（Pasal 59–193 大部分）因转录站懒加载未渲染，取自官方 PDF 文本；"
             "官方扫描件 Pasal 1 首页文字层缺失前半段（自第 6 项定义起），该条仍以官方 PDF 文字层为准并如实标注。"
             "2020 年第 11 号《创造就业法》及 2023 年第 6 号法律曾修改本法部分条款，本文件按 2003 年颁布原文录入。"),
    "ID-ARBITRATION-1999": dict(
        official="https://peraturan.go.id/id/uu-no-30-tahun-1999",
        pdf="https://peraturan.go.id/files/uu30-1999.pdf",
        slug="uu/uu-no-30-tahun-1999",
        note="全文：Pasal 1–Pasal 82（含官方 Penjelasan）；LN 1999 No. 138, TLN No. 3872。"
             "Pasal 1 因转录站懒加载未渲染，取自官方 PDF 文本。"),
    "ID-TRADE-2014": dict(
        official="https://peraturan.go.id/id/uu-no-7-tahun-2014",
        pdf="https://peraturan.go.id/files/uu7-2014bt.pdf",
        slug="uu/uu-no-7-tahun-2014",
        note="全文：Pasal 1–Pasal 122（含官方 Penjelasan）；LN 2014 No. 45, TLN No. 5512。"
             "共 11 条（含 Pasal 1、84、100、110）因转录站懒加载未渲染，取自官方 PDF 文本。"
             "2020 年第 11 号《创造就业法》曾修改本法部分条款，本文件按 2014 年颁布原文录入。"),
    "ID-LABOR-PP-2021": dict(
        official="https://peraturan.go.id/id/pp-no-35-tahun-2021",
        pdf="https://peraturan.bpk.go.id/Download/154582/PP%20Nomor%2035%20Tahun%202021.pdf",
        slug="pp/pp-no-35-tahun-2021",
        new=True,
        note="全文：Pasal 1–Pasal 66（含官方 Penjelasan）；LN 2021 No. 95, TLN No. 6647。"
             "Pasal 1 未在转录站目录中列出（该站此处缺条），文件按目录自 Pasal 2 起收录，"
             "Pasal 2、31、40、54、62 等 5 条取自官方 PDF 文本；Pasal 1 待补。"
             "本法规为 2020 年第 11 号《创造就业法》配套实施条例（固定期限劳动合同、外包、工作时间与休息时间、解除劳动关系）。"),
    "ID-ETRANSACTION-2019": dict(
        official="https://peraturan.go.id/id/pp-no-71-tahun-2019",
        pdf="https://peraturan.bpk.go.id/Download/112816/PP%20Nomor%2071%20Tahun%202019.pdf",
        slug="pp/pp-no-71-tahun-2019",
        new=True,
        note="全文：Pasal 1–Pasal 104（含官方 Penjelasan）；LN 2019 No. 185, TLN No. 6400。"
             "Pasal 1、14、69 因转录站懒加载未渲染，取自官方 PDF 文本。"
             "另：官方文本本身跳号，无 Pasal 61 与 Pasal 72（官方 PDF 目录与正文均无该两条），"
             "故条文序列为 …60、62… 与 …71、73…。"
             "本法规为电子系统与电子交易运营的实施条例（2019 年 10 月 10 日生效，曾由 2020 年第 71 号 PP 修订）。"),
    "ID-SCIENCE-2019": dict(
        official="https://peraturan.go.id/id/uu-no-11-tahun-2019",
        pdf="https://peraturan.bpk.go.id/Download/107926/UU%20Nomor%2011%20Tahun%202019.pdf",
        slug="uu/uu-no-11-tahun-2019",
        new=True,
        note="全文：Pasal 1–Pasal 100（含官方 Penjelasan）；LN 2019 No. 148, TLN No. 6374。"
             "转录站目录未列出 Pasal 1，官方 PDF 该条文字层 OCR 严重损坏（无法满足逐字要求），"
             "故本条（Pasal 1）未予收录，文件自 Pasal 2 起；Pasal 24、31 在官方 PDF 文字层中无标记（属跳号/缺页），"
             "故此两条暂缺，条文序列在 23→25、30→32 处跳号；Pasal 2、3、4、5、40、61、76 等条取自官方 PDF 文本。"
             "本法规为国家科学技术体系法（Sinas IPTEK，2020 年第 11 号《创造就业法》曾修改其个别条款）。"),
}

NEW_META = {
    "ID-TRADE-2014": {
        "country": "ID", "level": "law", "status": "amended",
        "topics": ["trade", "investment"],
        "title": {"zh": "印度尼西亚《贸易法》",
                  "en": "Law on Trade",
                  "id": "Undang-Undang tentang Perdagangan"},
        "docNumber": "Law No. 7 of 2014",
        "issuingBody": {"zh": "印度尼西亚人民代表会议", "en": "House of Representatives of Indonesia"},
        "promulgatedDate": "2014-03-11", "effectiveDate": "2014-03-11",
        "summary": {"zh": "印尼贸易领域的基础法律，规范国内贸易、对外贸易、边境贸易、标准与合格评定、贸易救济（反倾销、保障措施）及贸易监管，是印尼货物与服务贸易的主要法律依据。",
                    "en": "The basic Indonesian trade statute, governing domestic trade, foreign trade, border trade, standards and conformity assessment, trade remedies (anti-dumping, safeguards) and trade supervision."}
    },
    "ID-LABOR-PP-2021": {
        "country": "ID", "level": "regulation", "status": "active",
        "topics": ["labor"],
        "title": {"zh": "印度尼西亚《固定期限劳动合同、外包、工作时间与休息时间及解除劳动关系条例》",
                  "en": "Government Regulation on Fixed-Term Employment Agreements, Outsourcing, Working Time and Rest Periods, and Termination of Employment",
                  "id": "Peraturan Pemerintah tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja"},
        "docNumber": "PP No. 35 of 2021",
        "issuingBody": {"zh": "印度尼西亚共和国总统", "en": "President of the Republic of Indonesia"},
        "promulgatedDate": "2021-03-30", "effectiveDate": "2021-03-30",
        "summary": {"zh": "2020 年第 11 号《创造就业法》劳动领域配套实施条例，规定固定期限劳动合同（PKWT）、外包（alih daya）、工作时间与休息时间以及解除劳动关系的具体规则。",
                    "en": "Implementing regulation in the labour field under the 2020 Job Creation Law, governing fixed-term employment agreements (PKWT), outsourcing, working time and rest periods, and termination of employment."}
    },
    "ID-ETRANSACTION-2019": {
        "country": "ID", "level": "regulation", "status": "amended",
        "topics": ["data", "digital"],
        "title": {"zh": "印度尼西亚《电子系统与电子交易运营条例》",
                  "en": "Government Regulation on the Operation of Electronic Systems and Electronic Transactions",
                  "id": "Peraturan Pemerintah tentang Penyelenggaraan Sistem dan Transaksi Elektronik"},
        "docNumber": "PP No. 71 of 2019",
        "issuingBody": {"zh": "印度尼西亚共和国总统", "en": "President of the Republic of Indonesia"},
        "promulgatedDate": "2019-10-10", "effectiveDate": "2019-10-10",
        "summary": {"zh": "规定电子系统（含电子系统运营者登记、个人数据保护、电子认证）与电子交易（含电子合同、电子签名、电子支付）的运营规则，是印尼数字经济与数据治理的基础性条例；其部分条款经 2020 年第 71 号政府条例修订。",
                    "en": "Regulates the operation of electronic systems (registration of operators, personal data protection, electronic certification) and electronic transactions (electronic contracts, signatures, payments); a foundational regulation for Indonesia's digital economy and data governance."}
    },
    "ID-SCIENCE-2019": {
        "country": "ID", "level": "law", "status": "active",
        "topics": ["technology", "investment"],
        "title": {"zh": "印度尼西亚《国家科学技术体系法》",
                  "en": "Law on the National System of Science and Technology",
                  "id": "Undang-Undang tentang Sistem Nasional Ilmu Pengetahuan dan Teknologi"},
        "docNumber": "Law No. 11 of 2019",
        "issuingBody": {"zh": "印度尼西亚人民代表会议", "en": "House of Representatives of Indonesia"},
        "promulgatedDate": "2019-08-13", "effectiveDate": "2019-08-13",
        "summary": {"zh": "确立印尼国家科学技术体系（Sisnas IPTEK）的机构、资金、人才与激励制度，为科技研发与创新投资提供法律框架；2020 年第 11 号《创造就业法》曾修改其个别条款。",
                    "en": "Establishes the institutional, funding, human-resource and incentive framework of Indonesia's national science and technology system, providing the legal basis for research, development and innovation investment."}
    },
}


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def sort_key(lbl):
    m = re.match(r"^(\d+)([A-Za-z]*)$", str(lbl))
    return (int(m.group(1)), m.group(2)) if m else (10 ** 6, str(lbl))


def js_num(lbl):
    m = re.match(r"^(\d+)", str(lbl))
    return m.group(1) if m else "0"


def build_meta(lawid):
    if lawid in CORE:
        m = CORE[lawid]
    else:
        m = NEW_META[lawid]
    L = []
    L.append("  root.CALR_FULLTEXT_META[%s] = {" % js_str(lawid))
    L.append("    country: %s, level: %s, status: %s," % (js_str(m["country"]), js_str(m["level"]), js_str(m["status"])))
    L.append("    topics: [%s]," % ", ".join(js_str(t) for t in m["topics"]))
    L.append("    title: %s," % json.dumps(m["title"], ensure_ascii=False))
    if m.get("docNumber"):
        L.append("    docNumber: %s," % js_str(m["docNumber"]))
    L.append("    issuingBody: %s," % json.dumps(m["issuingBody"], ensure_ascii=False))
    L.append("    promulgatedDate: %s, effectiveDate: %s," % (js_str(m["promulgatedDate"]), js_str(m["effectiveDate"])))
    L.append("    coverage: 'full',")
    L.append("    source: { name: %s, url: %s }," % (
        js_str("Jaringan Dokumentasi dan Informasi Hukum (JDIHN) / peraturan.go.id"),
        js_str(CONF[lawid]["official"])))
    if m.get("summary"):
        L.append("    summary: %s" % json.dumps(m["summary"], ensure_ascii=False))
    L.append("  };")
    return "\n".join(L)


def build_law(lawid):
    d = json.load(open(os.path.join(FINAL, lawid + ".json"), encoding="utf-8"))
    conf = CONF[lawid]
    arts = sorted(d["articles"], key=lambda x: sort_key(x["label"]))
    L = []
    L.append("  root.CALR_FULLTEXT[%s] = {" % js_str(lawid))
    L.append("    id: %s," % js_str(lawid))
    L.append("    coverage: 'full',")
    L.append("    language: 'id',")
    L.append("    sourceName: %s," % js_str(SRC_OFFICIAL))
    L.append("    sourceUrl: %s," % js_str(conf["official"]))
    L.append("    sourceDocumentUrl: %s," % js_str(conf["pdf"]))
    L.append("    transcriptionUrl: %s," % js_str("https://pasal.id/peraturan/" + conf["slug"]))
    L.append("    fetchedAt: %s," % js_str(FETCHED_AT))
    L.append("    articleCount: %d," % len(arts))
    L.append("    completenessNote: %s," % js_str(conf["note"]))
    secs = d.get("sections") or []
    if secs:
        L.append("    structure: [")
        for s in secs:
            L.append("      { id: %s, articles: [%s] }," % (
                js_str(s["label"]), ", ".join(js_str(x) for x in s["articles"])))
        L.append("    ],")
    L.append("    articles: [")
    for a in arts:
        paras = a["paragraphs"]
        L.append("      {")
        L.append("        id: %s," % js_str("%s-A%s" % (lawid, a["label"])))
        L.append("        no: %s," % js_num(a["label"]))
        L.append("        noLabel: { id: %s }," % js_str("Pasal %s" % a["label"]))
        ch = a.get("chapter") or ""
        L.append("        chapter: {%s}," % ((" id: %s " % js_str(ch)) if ch else ""))
        L.append("        text: { id: %s }," % js_str("\n".join(paras)))
        if len(paras) > 1:
            L.append("        paragraphs: [%s]," % ", ".join(js_str(p) for p in paras))
        pen = a.get("penjelasan") or []
        if pen:
            L.append("        penjelasan: { id: %s }," % js_str("\n".join(pen)))
        src = conf["pdf"] if a.get("source") == "official-pdf" else (
            "https://pasal.id/peraturan/%s/pasal-%s" % (conf["slug"], a["label"]))
        L.append("        sourceUrl: %s," % js_str(src))
        L.append("      },")
    L.append("    ]")
    L.append("  };")
    return "\n".join(L)


HEADER = """/* ==========================================================================
   CALR · data/fulltext/id.js
   印度尼西亚法域 · 官方法规全文（印尼语原文，逐条不节选）
   规范见 docs/06-全文数据规范.md

   来源与核校说明：
   1) 发布主体：印度尼西亚法律与人权部国家法规门户 peraturan.go.id（JDIHN 体系）；
      本机在抓取期间无法连通 peraturan.go.id / jdihn.go.id / peraturan.bpk.go.id
      （连接超时或 Cloudflare 拦截），故正文取自上述官方 PDF 副本的逐条转录页
      （pasal.id，其页面 isBasedOn/PDF 来源标注为 peraturan.go.id 与 JDIH BPK），
      并以官方 PDF 文本逐条核校（相似度记录见 _work/id/final2/_report.json）。
   2) 转录站网页懒加载而未能渲染的条文（含多部法规的 Pasal 1），
      直接自官方 PDF（JDIHN/BPK 副本）抽取录入，其 sourceUrl 指向该官方 PDF。
   3) Penjelasan（官方说明）属法律组成部分，作为各条 penjelasan 字段独立保存，
      不混入条文正文。
   ========================================================================== */
(function (root) {
  'use strict';
  root.CALR_FULLTEXT = root.CALR_FULLTEXT || {};
  root.CALR_FULLTEXT_META = root.CALR_FULLTEXT_META || {};

  /* ====================== 新增法规元数据登记 ====================== */
"""

MID = """
  /* ====================== 官方全文 ====================== */
"""

FOOTER = """
})(typeof window !== 'undefined' ? window : globalThis);
"""


def main():
    meta_ids = [k for k in CONF if k not in CORE]
    parts = [HEADER]
    for lawid in meta_ids:
        parts.append("  /* %s —— 新法规元数据 */" % lawid)
        parts.append(build_meta(lawid))
        parts.append("")
    parts.append(MID)
    for lawid in CONF:
        parts.append("  /* ---------- %s ---------- */" % lawid)
        parts.append(build_law(lawid))
        parts.append("")
    parts.append(FOOTER)
    out = "\n".join(parts)
    with open(DEST, "w", encoding="utf-8") as f:
        f.write(out)
    print("written", DEST, len(out), "bytes")
    for lawid in CONF:
        d = json.load(open(os.path.join(FINAL, lawid + ".json"), encoding="utf-8"))
        fill = sum(1 for a in d["articles"] if a.get("source") == "official-pdf")
        print("  %-22s articles=%3d (官方PDF补录 %d)" % (lawid, len(d["articles"]), fill))


if __name__ == "__main__":
    main()
