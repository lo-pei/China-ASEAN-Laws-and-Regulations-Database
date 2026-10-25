#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CALR 后端 · 建库脚本
    prototype/data/laws/*.json  →  backend/data/calr.db  (SQLite)

设计要点
  · laws/ 是唯一权威数据源；本脚本只读不写 laws/
  · 表结构面向服务端检索：laws / articles / postings / doc_len / doc_terms
  · 法规级 BM25 倒排索引（与前端 JS 的口径一致：CJK 用 bigram、拉丁用词）
  · 条文逐条入库，供 /api/laws/{id} 与后续的条文级检索、向量化使用

用法
    python backend/build_db.py            # 全量重建
    python backend/build_db.py --limit 500   # 只建 500 部（调试）
"""
import argparse
import json
import os
import re
import sqlite3
import sys
import time
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LAWS = os.path.join(ROOT, "prototype", "data", "laws")
OUT_DIR = os.path.join(HERE, "data")
DB = os.path.join(OUT_DIR, "calr.db")

# ---------------------------------------------------------------- 分词
CJK = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]")
WORD = re.compile(r"[a-z0-9\u00c0-\u024f\u0e00-\u0e7f\u1e00-\u1eff]+")
STOP = set("""
的 了 和 与 及 或 在 是 为 对 中 上 下 之 其 有 无 不 也 等 就 而 并 但 由 从 以 一 二 三
the a an of to in for on and or is are be by as at from with that this it its shall may
""".split())


def tokenize(s: str):
    """CJK 取 unigram + bigram；拉丁/泰/越等取整词。与前端 util.tokenize 口径一致。"""
    if not s:
        return []
    s = unicodedata.normalize("NFKC", s).lower()
    out = []
    # 先按「CJK 连续段 / 非 CJK 段」切块
    buf_cjk = []
    i = 0
    n = len(s)
    while i < n:
        ch = s[i]
        if CJK.match(ch):
            buf_cjk.append(ch)
            i += 1
            continue
        if buf_cjk:
            seg = "".join(buf_cjk)
            for k in range(len(seg)):
                if seg[k] not in STOP:
                    out.append(seg[k])
            for k in range(len(seg) - 1):
                out.append(seg[k:k + 2])
            buf_cjk = []
        m = WORD.match(s, i)
        if m:
            w = m.group(0)
            if len(w) > 1 and w not in STOP:
                out.append(w)
            i = m.end()
        else:
            i += 1
    if buf_cjk:
        seg = "".join(buf_cjk)
        for k in range(len(seg)):
            if seg[k] not in STOP:
                out.append(seg[k])
        for k in range(len(seg) - 1):
            out.append(seg[k:k + 2])
    return out


# ---------------------------------------------------------------- 工具
def tget(t, *langs):
    """从 {zh,en,orig} 这类对象里按优先级取文本；字符串直接返回。
    注意：末尾有「任意语言兜底」，只适合 orig/heading 这类"取到什么算什么"的场景。
    给 text_en 用会把中文塞进英文槽，必须用 tget_strict。"""
    if not t:
        return ""
    if isinstance(t, str):
        return t
    if isinstance(t, dict):
        for lg in langs:
            v = t.get(lg)
            if v:
                return str(v)
        for v in t.values():
            if v:
                return str(v)
    return ""


def tget_strict(t, *langs):
    """只取指定语言，取不到返回空字符串。
    用于 text_zh / text_en 这类"语言槽必须名副其实"的列。
    背景：旧实现在这里回退到"任意语言"，导致 67,468 条中文被写进 text_en
    （占全部条文的 19.88%），英文界面下译文位置显示的是中文。"""
    if not t:
        return ""
    if isinstance(t, str):
        return t
    if isinstance(t, dict):
        for lg in langs:
            v = t.get(lg)
            if v:
                return str(v)
    return ""


def junk(v, limit=200):
    if v is None:
        return None
    s = json.dumps(v, ensure_ascii=False) if not isinstance(v, str) else v
    return s[:limit] if len(s) > limit else s


# ---------------------------------------------------------------- 建库
DDL = """
DROP TABLE IF EXISTS laws;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS postings;
DROP TABLE IF EXISTS doc_len;

CREATE TABLE laws (
  id            TEXT PRIMARY KEY,
  country       TEXT,
  country_name  TEXT,
  title_zh      TEXT,
  title_en      TEXT,
  title_orig    TEXT,
  layer         TEXT,
  pack          TEXT,
  language      TEXT,
  level         TEXT,
  category      TEXT,
  status        TEXT,
  promulgated   TEXT,
  effective     TEXT,
  version_date  TEXT,
  amended_note  TEXT,
  issuing_body  TEXT,
  doc_number    TEXT,
  official_code TEXT,
  topics        TEXT,
  coverage      TEXT,
  structure_mode TEXT,
  article_count INTEGER,
  chars         INTEGER,
  source        TEXT,
  summary       TEXT,
  text_quality  TEXT,
  numbering_conflict TEXT,
  raw           TEXT
);
CREATE INDEX idx_laws_country ON laws(country);
CREATE INDEX idx_laws_level   ON laws(level);
CREATE INDEX idx_laws_status  ON laws(status);

CREATE TABLE articles (
  law_id    TEXT NOT NULL,
  no        REAL,
  dup_index INTEGER,
  no_label  TEXT,
  heading   TEXT,
  chapter   TEXT,
  part_index INTEGER,
  text_zh   TEXT,
  text_en   TEXT,
  text_orig TEXT,
  lang      TEXT
);
CREATE INDEX idx_art_law ON articles(law_id, no);

CREATE TABLE postings (
  term   TEXT NOT NULL,
  law_id TEXT NOT NULL,
  tf     INTEGER NOT NULL
);
CREATE INDEX idx_post_term ON postings(term);

CREATE TABLE doc_len (
  law_id TEXT PRIMARY KEY,
  len    INTEGER NOT NULL
);
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="只建前 N 部（调试用）")
    ap.add_argument("--no-index", action="store_true", help="跳过倒排索引（只建元数据与条文）")
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    if os.path.exists(DB):
        os.remove(DB)
    con = sqlite3.connect(DB)
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("PRAGMA synchronous=OFF")
    con.executescript(DDL)

    files = sorted(f for f in os.listdir(LAWS) if f.endswith(".json") and f != "index.json")
    if args.limit:
        files = files[:args.limit]
    total = len(files)
    print("  待入库法规: %d" % total, flush=True)

    t0 = time.time()
    n_law = n_art = 0
    batch_laws, batch_arts, batch_post, batch_len = [], [], [], []

    for k, fn in enumerate(files, 1):
        try:
            with open(os.path.join(LAWS, fn), encoding="utf-8") as fh:
                o = json.load(fh)
        except Exception as e:
            print("  ! 跳过 %s: %s" % (fn, e), flush=True)
            continue
        lid = o.get("id") or fn[:-5]
        title = o.get("title") or {}
        arts = o.get("articles") or []

        batch_laws.append((
            lid,
            o.get("country"),
            o.get("countryName") or (o.get("countryName") if isinstance(o.get("countryName"), str) else None),
            tget(title, "zh"), tget(title, "en"), tget(title, "orig"),
            o.get("layer"), o.get("pack"), o.get("language"),
            o.get("level"), o.get("category"), o.get("status"),
            o.get("promulgatedDate"), o.get("effectiveDate"), o.get("versionDate"),
            junk(o.get("amendedNote"), 400),
            junk(o.get("issuingBody"), 300),
            junk(o.get("docNumber"), 200),
            junk(o.get("officialCode"), 200),
            junk(o.get("topics"), 400),
            o.get("coverage"),
            o.get("structureMode"),
            len(arts),
            o.get("chars") or 0,
            junk(o.get("source"), 500),
            junk(o.get("summary"), 500),
            junk(o.get("textQuality"), 200),
            junk(o.get("numberingConflict"), 400),
            None,  # raw 留空：体积太大，按需从 laws/ 读
        ))
        n_law += 1

        # 条文
        body_parts = []
        for a in arts:
            txt = a.get("text") or {}
            t_zh = tget_strict(txt, "zh")
            t_en = tget_strict(txt, "en")
            t_orig = tget(txt, "orig") or tget(txt, "th") or tget(txt, "vi") or tget(txt, "id") or tget(txt, "ms")
            batch_arts.append((
                lid, a.get("no"), a.get("dupIndex"),
                junk(a.get("noLabel"), 100),
                tget(a.get("heading"), "zh", "en"),
                junk(a.get("chapter"), 200),
                a.get("partIndex"),
                t_zh, t_en, t_orig,
                (o.get("language") or [None])[0] if isinstance(o.get("language"), list) else o.get("language"),
            ))
            n_art += 1
            body_parts.append(t_zh or t_en or t_orig or "")
            if t_zh and t_en:
                body_parts.append(t_en)

        # 法规级倒排（标题权重按 3 次重复计入，与前端 3*semTitle 的口径接近）
        if not args.no_index:
            title_txt = " ".join(x for x in [tget(title, "zh"), tget(title, "en"), tget(title, "orig")] if x)
            toks = tokenize(title_txt) * 3 + tokenize(" ".join(body_parts))
            if len(toks) > 200000:      # 超长法典截断，避免单条撑爆索引
                toks = toks[:200000]
            tf = {}
            for t in toks:
                tf[t] = tf.get(t, 0) + 1
            for t, c in tf.items():
                batch_post.append((t, lid, c))
            batch_len.append((lid, len(toks)))

        if len(batch_laws) >= 500:
            flush(con, batch_laws, batch_arts, batch_post, batch_len)
            batch_laws, batch_arts, batch_post, batch_len = [], [], [], []
            pct = k * 100.0 / total
            print("    %5d/%d  %.1f%%  法规 %d 条文 %d  %.0fs" % (k, total, pct, n_law, n_art, time.time() - t0), flush=True)

    flush(con, batch_laws, batch_arts, batch_post, batch_len)

    print("", flush=True)
    print("  建索引...", flush=True)
    con.commit()
    con.execute("ANALYZE")
    con.commit()

    cur = con.execute("SELECT COUNT(*) FROM laws")
    nl = cur.fetchone()[0]
    cur = con.execute("SELECT COUNT(*) FROM articles")
    na = cur.fetchone()[0]
    cur = con.execute("SELECT COUNT(*) FROM postings")
    np = cur.fetchone()[0]
    cur = con.execute("SELECT COUNT(DISTINCT term) FROM postings")
    nt = cur.fetchone()[0]
    cur = con.execute("SELECT SUM(len) FROM doc_len")
    tl = cur.fetchone()[0] or 0
    con.execute("CREATE TABLE IF NOT EXISTS meta(k TEXT PRIMARY KEY, v TEXT)")
    con.executemany("INSERT OR REPLACE INTO meta(k,v) VALUES(?,?)", [
        ("laws", str(nl)), ("articles", str(na)),
        ("postings", str(np)), ("terms", str(nt)), ("tokens", str(tl)),
        ("built_at", time.strftime("%Y-%m-%dT%H:%M:%S")),
        ("source", "prototype/data/laws/*.json"),
    ])
    con.commit()
    con.close()

    size = os.path.getsize(DB) / 1048576
    print("  ═══ 完成 ═══", flush=True)
    print("    法规 %d / 条文 %d / 倒排 %d 项 / 词项 %d / token %d" % (nl, na, np, nt, tl), flush=True)
    print("    DB 体积 %.1f MB   耗时 %.0fs" % (size, time.time() - t0), flush=True)
    print("    路径 %s" % DB, flush=True)


LAW_COLS = (
    "id,country,country_name,title_zh,title_en,title_orig,layer,pack,language,level,"
    "category,status,promulgated,effective,version_date,amended_note,issuing_body,"
    "doc_number,official_code,topics,coverage,structure_mode,article_count,chars,"
    "source,summary,text_quality,numbering_conflict,raw"
)
ART_COLS = ("law_id,no,dup_index,no_label,heading,chapter,part_index,"
            "text_zh,text_en,text_orig,lang")


def flush(con, laws, arts, post, dl):
    if laws:
        con.executemany(
            "INSERT OR REPLACE INTO laws(" + LAW_COLS + ") VALUES (" +
            ",".join("?" * len(LAW_COLS.split(","))) + ")", laws)
    if arts:
        con.executemany(
            "INSERT INTO articles(" + ART_COLS + ") VALUES (" +
            ",".join("?" * len(ART_COLS.split(","))) + ")", arts)
    if post:
        con.executemany("INSERT INTO postings(term,law_id,tf) VALUES (?,?,?)", post)
    if dl:
        con.executemany("INSERT OR REPLACE INTO doc_len(law_id,len) VALUES (?,?)", dl)
    con.commit()


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
