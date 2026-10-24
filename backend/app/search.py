# -*- coding: utf-8 -*-
"""
CALR 后端 · 检索层（BM25）

与前端 prototype/assets/js/core/search.js 保持同一口径：
  · 分词：CJK 取 unigram + bigram，拉丁/泰/越取整词（见 build_db.tokenize）
  · 法规级 BM25：k1=1.2, b=0.75，IDF 从倒排表实时算
  · 支持短语/文号/条号的轻量精确加权
  · 中国法域优先（PRIORITY_COUNTRY = CN），与前端策略一致

后续 Phase B 会在此基础上加「条文级 BM25 + 向量召回 + RRF 融合」。
"""
from __future__ import annotations

import math
import re
from typing import Any, Dict, List, Optional, Tuple

from . import db
from .build_db_compat import tokenize   # 复用同一套分词

K1 = 1.2
B = 0.75
PRIORITY_COUNTRY = "CN"

# 从问句里识别国别意图（与前端 detectCountries 对齐）
COUNTRY_WORDS = {
    "CN": ["中国", "中华人民共和国", "我国", "国内", "内地"],
    "VN": ["越南", "vietnam", "viet nam"],
    "TH": ["泰国", "thailand", "thai"],
    "MY": ["马来西亚", "malaysia"],
    "SG": ["新加坡", "singapore"],
    "ID": ["印度尼西亚", "印尼", "indonesia"],
    "PH": ["菲律宾", "philippines", "philippine"],
    "KH": ["柬埔寨", "cambodia"],
    "LA": ["老挝", "laos"],
    "MM": ["缅甸", "myanmar", "burma"],
    "BN": ["文莱", "brunei"],
    "TL": ["东帝汶", "timor"],
}


def detect_countries(q: str) -> List[str]:
    """返回问句里提到的法域代码（去重保序）。"""
    if not q:
        return []
    low = q.lower()
    out = []
    for code, words in COUNTRY_WORDS.items():
        for w in words:
            if w in low:
                out.append(code)
                break
    return out

# 中文同义/近义扩展（与前端 SYNONYMS 的核心子集对齐）
SYNONYMS = {
    "劳动": ["劳动合同", "劳动法", "雇佣", "用工", "职工"],
    "合同": ["协议", "契约", "contract"],
    "投资": ["外商投资", "外资", "investment"],
    "数据": ["个人信息", "数据保护", "数据安全", "data"],
    "公司": ["企业", "公司法", "company"],
    "仲裁": ["arbitration", "争议解决"],
    "税": ["税收", "所得税", "增值税", "tax"],
    "知识产权": ["专利", "商标", "著作权", "版权", "ip"],
    "土地": ["土地使用权", "不动产", "land"],
    "环境": ["环保", "污染", "environment"],
    "进出口": ["海关", "关税", "贸易", "customs"],
}

STATS_CACHE: Dict[str, Any] = {}


def _corpus_stats() -> Tuple[int, float]:
    if "n" not in STATS_CACHE:
        n = db.one("SELECT COUNT(*) FROM laws", default=0) or 0
        avg = db.one("SELECT AVG(len) FROM doc_len", default=0.0) or 0.0
        STATS_CACHE["n"] = n
        STATS_CACHE["avg"] = avg if avg > 0 else 500.0
    return STATS_CACHE["n"], STATS_CACHE["avg"]


def expand(tokens: List[str]) -> List[str]:
    out = list(tokens)
    for t in tokens:
        for k, vs in SYNONYMS.items():
            if k in t or t in k:
                out.extend(vs)
    # 去重保序
    seen, res = set(), []
    for t in out:
        if t not in seen:
            seen.add(t)
            res.append(t)
    return res


def _norm_title(s: str) -> str:
    """与前端 search.js 一致：剥掉「中华人民共和国 / 中国」前缀再比较。

    东盟各国整理稿的中文标题直接就是「民法典」，而中国是「中华人民共和国民法典」，
    不做归一化中国法规在「标题精确匹配」上永远吃亏。
    """
    if not s:
        return ""
    s = re.sub(r"\s+", "", str(s)).lower()
    return re.sub(r"^(中华人民共和国|中国)", "", s)


# 法规级「有正文」信息：从 articles 表算一次并缓存
_ART_CNT: Dict[str, int] = {}


def _article_counts(ids: List[str]) -> Dict[str, int]:
    need = [i for i in ids if i not in _ART_CNT]
    if need:
        for chunk_start in range(0, len(need), 500):
            chunk = need[chunk_start:chunk_start + 500]
            ph = ",".join("?" * len(chunk))
            for r in db.rows(
                "SELECT law_id, COUNT(*) n FROM articles WHERE law_id IN (" + ph + ") GROUP BY law_id",
                chunk):
                _ART_CNT[r["law_id"]] = r["n"]
        for i in need:
            _ART_CNT.setdefault(i, 0)
    return {i: _ART_CNT.get(i, 0) for i in ids}


def search(q: str, mode: str = "keyword", country: Optional[str] = None,
           level: Optional[str] = None, status: Optional[str] = None,
           page: int = 1, size: int = 20) -> Dict[str, Any]:
    q = (q or "").strip()
    if not q:
        return db.list_laws(country=country, level=level, status=status, page=page, size=size)

    N, AVG = _corpus_stats()
    toks = tokenize(q)
    if mode == "semantic":
        toks = expand(toks)
    # 去重
    seen, terms = set(), []
    for t in toks:
        if t not in seen:
            seen.add(t)
            terms.append(t)
    terms = terms[:40]

    # 取候选法规的 tf
    ph = ",".join("?" * len(terms))
    prs = db.rows(
        "SELECT term, law_id, tf FROM postings WHERE term IN (" + ph + ")",
        terms)
    if not prs and not country:
        return {"total": 0, "page": page, "size": size, "pages": 0, "items": [], "query": q}

    # df
    df: Dict[str, int] = {}
    postings: Dict[str, Dict[str, int]] = {}
    for r in prs:
        df[r["term"]] = df.get(r["term"], 0) + 1
        postings.setdefault(r["law_id"], {})[r["term"]] = r["tf"]

    # 打分
    scores: Dict[str, float] = {}
    for lid, tf_map in postings.items():
        s = 0.0
        for t, tf in tf_map.items():
            d = df.get(t, 1)
            idf = math.log(1 + (N - d + 0.5) / (d + 0.5))
            s += idf * (tf * (K1 + 1)) / (tf + K1 * (1 - B))
        scores[lid] = s

    if not scores and not country:
        return {"total": 0, "page": page, "size": size, "pages": 0, "items": [], "query": q}

    # ---- 问句点名的国别：限定补跑一次，把该国法规拉进候选 ----
    # 背景：中文问句在中国法里的词法命中远高于外文法规，
    # BM25 阶段前几百名会被中国法占满，目标国的法规即使高度相关也进不了候选，
    # 后面的加权就没机会看到它。所以这里先按国别补一轮。
    q_countries = []
    if not country:
        try:
            q_countries = detect_countries(q)
        except Exception:
            q_countries = []
    only_country = q_countries[0] if len(q_countries) == 1 else None
    if only_country:
        ph1 = ",".join("?" * len(terms))
        try:
            prs2 = db.rows(
                "SELECT p.term, p.law_id, p.tf FROM postings p "
                "JOIN laws l ON l.id = p.law_id "
                "WHERE p.term IN (" + ph1 + ") AND l.country = ?",
                terms + [only_country])
        except Exception:
            prs2 = []
        if prs2:
            df2: Dict[str, int] = {}
            post2: Dict[str, Dict[str, int]] = {}
            for r in prs2:
                df2[r["term"]] = df2.get(r["term"], 0) + 1
                post2.setdefault(r["law_id"], {})[r["term"]] = r["tf"]
            for lid, tf_map in post2.items():
                if lid in scores:
                    continue
                v = 0.0
                for t, tf in tf_map.items():
                    d = max(1, df2.get(t, 1))
                    # 用该国子集的 df 算 idf：在这个国家内部区分度更高
                    idf = math.log(1 + (N - d + 0.5) / (d + 0.5))
                    v += idf * (tf * (K1 + 1)) / (tf + K1 * (1 - B))
                scores[lid] = v * 0.9      # 略低于全局同分，避免凭空压过全局强命中

    # ---- 加权：标题归一化精确匹配 + 标题命中率 + 中国优先 + 有正文优先 ----
    # 性能：先把纯 BM25 得分排序并做相关性门槛，只对前 CAND_LIMIT 名做标题分词等重活
    # （否则对上万候选逐个分词会让单次检索从 0.3s 涨到 2s）。
    # 注意：total 用「门槛后的全量条数」，不能因为限流而变小。
    CAND_LIMIT = 800
    hint_norm = _norm_title(q)
    q_terms = set(terms)

    full = sorted(scores.items(), key=lambda x: -x[1])
    if full:
        floor = full[0][1] * 0.15          # 与前端一致：低于最高分 15% 视为不相关
        full = [(lid, s) for lid, s in full if s >= floor]
    total_after_floor = len(full)

    pre = full[:CAND_LIMIT]
    cand = [lid for lid, _ in pre]
    scores = dict(pre)

    meta: Dict[str, Any] = {}
    if cand:
        for chunk_start in range(0, len(cand), 500):
            chunk = cand[chunk_start:chunk_start + 500]
            ph2 = ",".join("?" * len(chunk))
            for r in db.rows(
                "SELECT id,country,level,status,title_zh,title_en,title_orig,doc_number "
                "FROM laws WHERE id IN (" + ph2 + ")", chunk):
                meta[r["id"]] = r
    art_cnt = _article_counts(cand) if cand else {}
    # 全局最高 BM25 分，作为国别加分的量级基准
    max_base = max(scores.values()) if scores else 0.0

    for lid, s in list(scores.items()):
        m = meta.get(lid)
        if not m:
            continue
        title_blob = " ".join(x for x in [m["title_zh"], m["title_en"], m["title_orig"]] if x)
        t_toks = set(tokenize(title_blob))

        # ① 标题命中率：查询词有多少出现在标题里（区分「法规讲这个话题」与「只是提到这个词」）
        # 权重从 30 提到 45：实测「泰国劳动法」「新加坡公司法」这类问句，
        # 目标法规的标题其实就是查询词的子串，但原权重压不住正文词频。
        if q_terms:
            hit = len(q_terms & t_toks) / float(len(q_terms))
            s += 45.0 * hit

        # ② 标题归一化后与查询完全一致
        exact = False
        if len(hint_norm) >= 2:
            for col in ("title_zh", "title_en", "title_orig"):
                if _norm_title(m[col]) == hint_norm:
                    exact = True
                    break
        if exact:
            s += 45
            if m["country"] == PRIORITY_COUNTRY:
                s += 25

        # ③ 无标题的记录（多为采集缺失）降低优先级，避免占满首屏
        if not (m["title_zh"] or m["title_en"] or m["title_orig"]):
            s *= 0.55

        # ④ 有正文条文的优先于「仅目录」
        nart = art_cnt.get(lid, 0)
        if nart > 0:
            s += 12 + min(8, math.log10(nart + 1) * 4)

        # ⑤ 问句唯一点名了某个国家：该国法规加一个与全局最高分同量级的加分
        #    用乘性量级而不是固定值，因为不同查询的 BM25 分数尺度差很多
        #    （短查询几十分，长查询几百分）
        if only_country and m["country"] == only_country:
            s += 1.15 * max_base
        scores[lid] = s

    # 加权后重新排序（此时只有前 CAND_LIMIT 名参与，total 用上面算好的全量数）
    order = sorted(scores.items(), key=lambda x: -x[1])

    # 过滤
    if country or level or status:
        keep = []
        for lid, s in order:
            m = meta.get(lid)
            if not m:
                continue
            if country and m["country"] != country.upper():
                continue
            if level and m["level"] != level:
                continue
            if status and m["status"] != status:
                continue
            keep.append((lid, s))
        order = keep

    total = max(len(order), total_after_floor)
    size = max(1, min(200, size))
    page = max(1, page)
    start = (page - 1) * size
    page_items = order[start:start + size]

    ids = [lid for lid, _ in page_items]
    items = []
    if ids:
        ph3 = ",".join("?" * len(ids))
        rs = {r["id"]: r for r in db.rows("SELECT * FROM laws WHERE id IN (" + ph3 + ")", ids)}
        for lid, s in page_items:
            r = rs.get(lid)
            if not r:
                continue
            d = db.law_dict(r)
            d["score"] = round(s, 2)
            items.append(d)

    return {"total": total, "page": page, "size": size,
            "pages": (total + size - 1) // size, "items": items, "query": q, "mode": mode}


def article_hits(q: str, law_id: str, limit: int = 3) -> List[Dict[str, Any]]:
    """在指定法规内按条文打分（供详情页「命中条文」与后续 QA 用）。"""
    toks = tokenize(q or "")
    seen, terms = set(), []
    for t in toks:
        if t not in seen:
            seen.add(t)
            terms.append(t)
    if not terms:
        return []
    arts = db.rows("SELECT * FROM articles WHERE law_id=?", (law_id,))
    best = []
    for a in arts:
        blob = " ".join(x for x in [a["text_zh"], a["text_en"], a["text_orig"]] if x)
        at = set(tokenize(blob))
        hit = sum(1 for t in terms if t in at)
        if hit:
            best.append((hit, a))
    best.sort(key=lambda x: -x[0])
    return [{"hit": h, "article": db.article_dict(a)} for h, a in best[:limit]]
