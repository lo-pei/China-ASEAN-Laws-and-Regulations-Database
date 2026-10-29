/* ==========================================================================
   CALR · core/util.js —— 基础工具（DOM、格式化、文本、弹层、导出）
   零依赖传统脚本；挂载于 window.CALR.util
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};

  var util = {};

  /* ---------------- DOM ---------------- */
  util.$ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  util.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  util.on = function (el, type, fn, opts) { if (el) el.addEventListener(type, fn, opts || false); return el; };
  util.esc = function (s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  util.attr = function (s) { return util.esc(s); };

  /* ---------------- 多语言字段 ---------------- */
  /** 从 {zh,en,...} 取当前语言，回退到 zh、en 或首个非空值 */
  util.tr = function (field, lang) {
    if (field === null || field === undefined) return '';
    if (typeof field === 'string') return field;
    lang = lang || (CALR.i18n && CALR.i18n.lang()) || 'zh';
    if (field[lang]) return field[lang];
    /* 缺当前语言时优先回退英文，避免非中文界面出现中文 */
    if (field.en) return field.en;
    if (field.zh) return field.zh;
    /* 最后退到「任意非空值」——不能直接取 keys[0]：
       形如 {zh:null, en:null, my:'…'} 的标题（如仅有缅甸文译名的法规）会取到 null，
       调用方再 .replace() 就会抛 TypeError，整页渲染失败。 */
    for (var k in field) {
      if (Object.prototype.hasOwnProperty.call(field, k) && field[k]) return field[k];
    }
    return '';
  };
  /** 取所有非当前语言的并列标题 */
  util.altTitles = function (field, lang, max) {
    if (!field || typeof field !== 'object') return [];
    var out = [];
    ['zh', 'en', 'vi', 'th', 'id', 'ms', 'my', 'km', 'lo'].forEach(function (k) {
      if (k === lang) return;
      if (field[k]) out.push({ lang: k, text: field[k] });
    });
    return max ? out.slice(0, max) : out;
  };

  /* ---------------- 日期 ---------------- */
  util.fmtDate = function (iso, withDay) {
    if (!iso) return '—';
    var p = String(iso).split('-');
    if (p.length < 3) return iso;
    var mm = ('0' + p[1]).slice(-2), dd = ('0' + p[2]).slice(-2);
    /* 非中文界面使用 ISO 形式，避免出现「年/月/日」 */
    if (CALR.i18n && CALR.i18n.lang && CALR.i18n.lang() !== 'zh') {
      return withDay === false ? (p[0] + '-' + mm) : (p[0] + '-' + mm + '-' + dd);
    }
    return withDay === false ? (p[0] + '年' + p[1] + '月') : (p[0] + '年' + p[1] + '月' + p[2] + '日');
  };
  util.daysFrom = function (iso, base) {
    if (!iso) return null;
    var d = new Date(iso + 'T00:00:00');
    var b = base ? new Date(base + 'T00:00:00') : new Date('2026-10-01T00:00:00');
    return Math.round((d - b) / 86400000);
  };
  /** 生效倒计时文案 */
  util.countdown = function (iso) {
    var d = util.daysFrom(iso);
    if (d === null) return '';
    if (d <= 0) return '已生效';
    return '距生效 ' + d + ' 天';
  };

  /* ---------------- 文本 ---------------- */
  /** 轻量分词：CJK 单字+二元组，拉丁词按空格/标点切分 */
  util.tokenize = function (text) {
    if (!text) return [];
    var s = String(text).toLowerCase();
    var out = [];
    var cjk = s.match(/[\u3400-\u9fff\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff\u0e80-\u0eff]/g);
    if (cjk) {
      out = out.concat(cjk);
      for (var i = 0; i < cjk.length - 1; i++) out.push(cjk[i] + cjk[i + 1]);
    }
    var latin = s.replace(/[^\w\u00c0-\u024f]+/g, ' ').split(' ');
    for (var j = 0; j < latin.length; j++) if (latin[j] && latin[j].length > 1) out.push(latin[j]);
    return out;
  };

  /** 严格分词（检索用）：CJK 只取二元组，去掉单字 —— 单字（的/条/法）噪声极大；
      拉丁词 ≥2 字符。与 tokenize 保持同一字符集范围，保证查询与正文可比。 */
  util.tokenizeStrict = function (text) {
    if (!text) return [];
    var s = String(text).toLowerCase();
    var out = [];
    var cjk = s.match(/[\u3400-\u9fff\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff\u0e80-\u0eff]/g);
    if (cjk) {
      for (var i = 0; i < cjk.length - 1; i++) out.push(cjk[i] + cjk[i + 1]);
    }
    var latin = s.replace(/[^\w\u00c0-\u024f]+/g, ' ').split(' ');
    for (var j = 0; j < latin.length; j++) if (latin[j] && latin[j].length > 1) out.push(latin[j]);
    return out;
  };

  util.plain = function (html) { return String(html || '').replace(/<[^>]*>/g, ''); };
  util.truncate = function (text, n) {
    text = String(text || '');
    return text.length > n ? text.slice(0, n) + '…' : text;
  };

  /** 法条文本按「款」拆分为自然段数组（用于逐段首行缩进） */
  util.paragraphs = function (text) {
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
            /* 英文行尾连字符：去掉连字符直接拼（如 exam- / ple → example） */
            merged[prevIdx] = prev.trim().slice(0, -1) + t.trim();
          } else if (/[0-9A-Za-z)]\s*$/.test(prev) && /^[0-9A-Za-z(\[]/.test(t.trim())) {
            /* 两侧都是拉丁字母/数字：补一个空格，避免 "processes; and(b)" 这种粘连 */
            merged[prevIdx] = prev.replace(/\s+$/, '') + ' ' + t.trim();
          } else {
            /* 中文与其它情况直接拼，不插空格 */
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
  };

  /** 把法条文本渲染为逐段缩进的 <p> 序列（html 为可选的逐段渲染函数） */
  util.paragraphHtml = function (text, htmlOf, cls) {
    var ps = util.paragraphs(text);
    var klass = cls || 'text-p';
    return ps.map(function (p, i) {
      return '<p class="' + klass + '">' + (htmlOf ? htmlOf(p, i) : util.esc(p)) + '</p>';
    }).join('');
  };

  /** 关键词高亮（先转义再包裹） */
  util.highlight = function (text, terms) {
    var safe = util.esc(text);
    if (!terms || !terms.length) return safe;
    var uniq = [];
    terms.forEach(function (t) {
      t = String(t || '').trim();
      if (t.length < 2 || uniq.indexOf(t) >= 0) return;
      uniq.push(t);
    });
    uniq.sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < uniq.length && i < 12; i++) {
      var pat = uniq[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      try {
        safe = safe.replace(new RegExp(pat, 'gi'), function (m) { return '<span class="hl">' + m + '</span>'; });
      } catch (e) { /* 忽略非法正则 */ }
    }
    return safe;
  };

  /** 字符 2-gram Jaccard 相似度，用于条文差异比对 */
  util.similarity = function (a, b) {
    var A = gram2(a), B = gram2(b);
    if (!A.length || !B.length) return 0;
    var setB = {}, inter = 0;
    B.forEach(function (g) { setB[g] = (setB[g] || 0) + 1; });
    var used = {};
    A.forEach(function (g) {
      if (setB[g] && !used[g]) { inter++; used[g] = 1; }
    });
    var uni = A.length + B.length - inter;
    return uni <= 0 ? 0 : Math.round((inter / uni) * 100);
  };
  function gram2(s) {
    s = String(s || '').replace(/[\s\u3000]+/g, '');
    var out = [];
    for (var i = 0; i < s.length - 1; i++) out.push(s.substr(i, 2));
    if (s.length === 1) out.push(s);
    return out;
  }

  /* ---------------- 交互 ---------------- */
  util.debounce = function (fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait || 200);
    };
  };

  util.copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return util.copyFallback(text); });
    }
    return Promise.resolve(util.copyFallback(text));
  };
  util.copyFallback = function (text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta); return true;
    } catch (e) { return false; }
  };

  util.download = function (filename, content, mime) {
    try {
      var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
      return true;
    } catch (e) { return false; }
  };

  /** CSV 导出（带 BOM，Excel 友好） */
  util.toCsv = function (rows) {
    var esc = function (v) {
      v = v === null || v === undefined ? '' : String(v);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    };
    return '\ufeff' + rows.map(function (r) { return r.map(esc).join(','); }).join('\r\n');
  };

  /* ---------------- 提示与弹层 ---------------- */
  util.toast = function (msg, kind) {
    var host = util.$('#toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-host'; host.className = 'toast-host';
      document.body.appendChild(host);
    }
    var t = document.createElement('div');
    t.className = 'toast' + (kind ? ' toast--' + kind : '');
    t.textContent = msg;
    host.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2200);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2700);
  };

  util.modal = function (opts) {
    util.closeModal();
    var mask = document.createElement('div');
    mask.className = 'modal-mask'; mask.id = 'calr-modal';
    mask.innerHTML =
      '<div class="modal' + (opts.wide ? ' modal--wide' : '') + '" role="dialog" aria-modal="true" aria-label="' + util.attr(opts.title) + '">' +
        '<div class="modal__head"><h3 class="modal__title">' + util.esc(opts.title) + '</h3>' +
        '<button class="modal__close" type="button" aria-label="关闭" data-modal-close>&times;</button></div>' +
        '<div class="modal__body">' + opts.body + '</div>' +
        (opts.foot ? '<div class="modal__foot">' + opts.foot + '</div>' : '') +
      '</div>';
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) {
      if (e.target === mask || e.target.hasAttribute('data-modal-close')) util.closeModal();
    });
    document.addEventListener('keydown', escClose);
    function escClose(e) { if (e.key === 'Escape') util.closeModal(); }
    mask._esc = escClose;
    return mask;
  };
  util.closeModal = function () {
    var m = util.$('#calr-modal');
    if (m) {
      if (m._esc) document.removeEventListener('keydown', m._esc);
      m.parentNode.removeChild(m);
    }
  };

  /* ---------------- 杂项 ---------------- */
  util.pct = function (n, total) { return total > 0 ? Math.round((n / total) * 100) : 0; };
  util.num = function (n) {
    if (n === null || n === undefined) return '—';
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  util.uniq = function (arr) {
    var seen = {}, out = [];
    (arr || []).forEach(function (x) { if (x !== undefined && x !== null && !seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  };
  util.groupBy = function (arr, keyFn) {
    var out = {};
    (arr || []).forEach(function (x) { var k = keyFn(x); (out[k] = out[k] || []).push(x); });
    return out;
  };
  util.query = function (search) {
    var out = {};
    String(search || '').replace(/^\?/, '').split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      var k = i < 0 ? kv : kv.slice(0, i);
      var v = i < 0 ? '' : kv.slice(i + 1);
      try { out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' ')); }
      catch (e) { out[k] = v; }
    });
    return out;
  };
  util.toQuery = function (obj) {
    var parts = [];
    Object.keys(obj || {}).forEach(function (k) {
      var v = obj[k];
      if (v === undefined || v === null || v === '' || v === false) return;
      parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return parts.join('&');
  };

  /** 条号标签本地化：优先用数据里的 noLabel，缺失时按界面语言生成，不再回退中文 */
  util.articleLabel = function (a) {
    var lang = (CALR.i18n && CALR.i18n.lang()) || 'zh';
    var label = a && a.noLabel;
    if (typeof label === 'string') return label;
    if (label && label[lang]) return label[lang];
    if (label && label.en) return label.en;
    var n = a && a.no !== undefined && a.no !== null ? a.no : '';
    if (lang === 'zh') return label && label.zh ? label.zh : (n !== '' ? '第 ' + n + ' 条' : '');
    var prefix = { en: 'Article ', vi: 'Điều ', th: 'มาตรา ', id: 'Pasal ', ms: 'Seksyen ' }[lang] || 'Article ';
    return n !== '' ? prefix + n : '';
  };

  CALR.util = util;
})(typeof window !== 'undefined' ? window : globalThis);
