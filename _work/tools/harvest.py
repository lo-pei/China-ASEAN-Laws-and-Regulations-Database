# -*- coding: utf-8 -*-
"""
CALR 官方数据抓取工具（供各法域抓取脚本复用）
依赖：标准库 + lxml（内置）+ pypdf（已安装到 _work/pylibs）

用法示例：
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__)))   # 或直接放到 tools 目录
    from harvest import get, get_text, html_text, pdf_text, download, save_json

    html = get_text("https://sso.agc.gov.sg/Act/PDPA2012?WholeDoc=1")
    txt  = html_text(html, drop_selectors=["nav", "footer", ".toc"])
"""
import gzip
import hashlib
import io
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.dirname(HERE)
CACHE = os.path.join(WORK, "cache")
PYLIBS = os.path.join(WORK, "pylibs")
if PYLIBS not in sys.path:
    sys.path.insert(0, PYLIBS)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")

DEFAULT_HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.8,*/*;q=0.7",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,vi;q=0.7,th;q=0.6,id;q=0.6,ms;q=0.6",
    "Connection": "close",
}

_last_request = [0.0]


def _cache_path(url, suffix=""):
    os.makedirs(CACHE, exist_ok=True)
    key = hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]
    return os.path.join(CACHE, key + suffix)


def get(url, data=None, headers=None, timeout=45, retries=3, cache=True,
        min_interval=0.8, method=None):
    """抓取 URL 返回 bytes。带 UA、gzip 解压、重试、磁盘缓存与限速。"""
    if cache:
        cp = _cache_path(url)
        if os.path.exists(cp) and os.path.getsize(cp) > 0:
            with open(cp, "rb") as f:
                return f.read()

    hdrs = dict(DEFAULT_HEADERS)
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, data=data, headers=hdrs, method=method)
    last_err = None
    for attempt in range(retries):
        gap = time.time() - _last_request[0]
        if gap < min_interval:
            time.sleep(min_interval - gap)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                raw = resp.read()
                if resp.headers.get("Content-Encoding") == "gzip":
                    raw = gzip.decompress(raw)
                _last_request[0] = time.time()
                if cache:
                    with open(_cache_path(url), "wb") as f:
                        f.write(raw)
                return raw
        except urllib.error.HTTPError as e:
            last_err = "HTTP %s %s" % (e.code, e.reason)
            if e.code in (403, 404, 410):
                break
        except Exception as e:  # noqa
            last_err = str(e)
        time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("抓取失败 %s :: %s" % (url, last_err))


def decode(raw, encoding=None):
    if encoding:
        return raw.decode(encoding, "replace")
    head = raw[:4096].decode("ascii", "ignore")
    m = re.search(r'charset=["\']?([\w\-]+)', head, re.I)
    if m:
        enc = m.group(1).lower()
        if enc in ("gb2312", "gbk", "gb-2312"):
            enc = "gb18030"
        try:
            return raw.decode(enc, "replace")
        except LookupError:
            pass
    # 未声明编码：先严格 UTF-8；失败后按“西文/东南亚”优先 cp1252（避免把 \x96 等
    # Windows-1252 标点误当作 GB 双字节序列而产出 ï¿½ 乱码），最后再退回 gb18030
    for enc in ("utf-8", "cp1252", "gb18030", "latin-1"):
        try:
            return raw.decode(enc)
        except (UnicodeDecodeError, LookupError):
            continue
    return raw.decode("utf-8", "replace")


def get_text(url, **kw):
    return decode(get(url, **kw), kw.pop("encoding", None))


def html_text(html, xpath=None, drop_selectors=None, keep_linebreaks=True):
    """用 lxml 提取正文文本（去掉脚本、样式与指定噪声节点）"""
    from lxml import html as LH
    doc = LH.fromstring(html)
    for bad in doc.xpath("//script | //style | //noscript | //iframe | //svg"):
        bad.getparent().remove(bad)
    for sel in (drop_selectors or []):
        for node in doc.cssselect(sel):
            node.getparent().remove(node)
    root = doc.xpath(xpath)[0] if xpath else (doc.find("body") if doc.find("body") is not None else doc)
    # 让块级元素之间保留换行
    blocks = ("p", "div", "br", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6",
              "section", "article", "blockquote", "table", "pre")
    parts = []
    for node in root.iter():
        tag = node.tag if isinstance(node.tag, str) else ""
        if tag in ("p", "div", "br", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6",
                   "section", "article", "blockquote", "table"):
            parts.append("\n")
        if node.text:
            parts.append(node.text)
        if node.tail:
            parts.append(node.tail)
    text = "".join(parts)
    return normalise(text)


def normalise(text):
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("\u00a0", " ").replace("\ufeff", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n[ \t]+", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def pdf_text(path_or_bytes, pages=None):
    """用 pypdf 提取 PDF 文本；path_or_bytes 可为本地路径或 bytes"""
    from pypdf import PdfReader
    if isinstance(path_or_bytes, (bytes, bytearray)):
        reader = PdfReader(io.BytesIO(path_or_bytes))
    else:
        reader = PdfReader(path_or_bytes)
    out = []
    total = len(reader.pages)
    idx = range(total) if pages is None else pages
    for i in idx:
        try:
            out.append(reader.pages[i].extract_text() or "")
        except Exception as e:  # noqa
            out.append("")
    return "\n".join(out), total


def download(url, dest, **kw):
    raw = get(url, **kw)
    os.makedirs(os.path.dirname(os.path.abspath(dest)), exist_ok=True)
    with open(dest, "wb") as f:
        f.write(raw)
    return dest, len(raw)


def save_text(path, text):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    return path


def strip_page_noise(text):
    """去掉页码、页眉页脚等常见噪声行"""
    out = []
    for line in text.split("\n"):
        s = line.strip()
        if not s:
            out.append("")
            continue
        if re.fullmatch(r"[-–—\s]*\d{1,3}[-–—\s]*", s):      # 纯页码
            continue
        if re.fullmatch(r"[ivxlcdm]{1,6}", s, re.I):           # 罗马数字页码
            continue
        out.append(s)
    return normalise("\n".join(out))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "selftest"
    if cmd == "selftest":
        html = get_text("https://sso.agc.gov.sg/Act/PDPA2012?WholeDoc=1")
        txt = html_text(html)
        print("SG PDPA HTML chars:", len(txt))
        print(txt[:300].replace("\n", " | "))
    elif cmd == "pdf":
        txt, pages = pdf_text(sys.argv[2])
        print("pages:", pages, "chars:", len(txt))
        print(txt[:500])
