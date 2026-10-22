/* ==========================================================================
   CALR · core/fulltext.js —— 官方全文的按需/渐进加载
   全文文件：prototype/data/fulltext/<cc>.js → window.CALR_FULLTEXT[lawId]
   规范见 docs/06-全文数据规范.md
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};

  var loaded = {};      /* 已加载的法域文件 */
  var failed = {};      /* 加载失败的法域文件 */
  var promises = {};    /* 进行中的加载 Promise */
  var listeners = [];

  function manifest() {
    return root.CALR_FULLTEXT_MANIFEST || { files: [], byLaw: {} };
  }

  function basePath() {
    /* 以 index.html 所在目录为基准，兼容 file:// 与 http:// */
    var loc = root.location ? String(root.location.href) : '';
    var cut = loc.indexOf('#');
    if (cut >= 0) loc = loc.slice(0, cut);
    cut = loc.indexOf('?');
    if (cut >= 0) loc = loc.slice(0, cut);
    var slash = loc.lastIndexOf('/');
    return slash >= 0 ? loc.slice(0, slash + 1) : '';
  }

  function inject(relPath) {
    return new Promise(function (resolve, reject) {
      var s = root.document.createElement('script');
      s.src = basePath() + relPath;
      s.async = false;
      s.onload = function () { resolve(true); };
      s.onerror = function () { reject(new Error('无法加载 ' + relPath)); };
      (root.document.head || root.document.body).appendChild(s);
    });
  }

  var filePromises = {};
  var packLoaded = {};

  /** 按相对路径加载任意全文文件（如 'data/fulltext/cn.js'、'data/cn/cn-p01.js'） */
  function loadFile(relPath) {
    if (!relPath) return Promise.resolve(false);
    if (filePromises[relPath]) return filePromises[relPath];
    filePromises[relPath] = inject(relPath).then(function () { return true; }, function () {
      failed[relPath] = true;
      return false;
    });
    return filePromises[relPath];
  }

  /** 查询某部法规是否存在可加载的条文分卷；返回 {kind, file}，无全文时返回 null */
  function packFor(lawId) {
    var byLaw = manifest().byLaw || {};
    if (byLaw[lawId]) return { kind: 'jurisdiction', file: byLaw[lawId] };
    var cat = root.CALR_CN_CATALOG;
    if (cat && cat.laws) {
      for (var i = 0; i < cat.laws.length; i++) {
        if (cat.laws[i].id === lawId && cat.laws[i].pack) return { kind: 'cn', file: cat.laws[i].pack };
      }
    }
    var im = root.CALR_INTL_MANIFEST;
    var f = (im && im.byLaw) ? im.byLaw[lawId] : null;
    if (f) return { kind: 'intl', file: f };
    return null;
  }

  /** 确保某部法规的全文已载入（法域文件 → 中国全量目录分卷 → 东盟法律分卷） */
  function ensureLaw(lawId) {
    if (entry(lawId)) return Promise.resolve(true);
    var pack = packFor(lawId);
    if (!pack) return Promise.resolve(false);
    if (pack.kind === 'jurisdiction') {
      return load(pack.file).then(function (ok) { return ok ? true : loadPackOf(lawId); });
    }
    return loadPackOf(lawId);
  }

  /** 批量确保若干法规的全文已载入（供 AI 问答按需补全条文） */
  function ensureLaws(lawIds) {
    var ids = (lawIds || []).filter(function (x) { return x; });
    if (!ids.length) return Promise.resolve({ ok: 0, failed: 0 });
    var ok = 0, failed = 0;
    return Promise.all(ids.map(function (id) {
      return ensureLaw(id).then(function (r) { if (r) ok++; else failed++; return r; });
    })).then(function () { return { ok: ok, failed: failed, total: ids.length }; });
  }

  function loadPackOf(lawId) {
    var pack = packFor(lawId);
    if (!pack || pack.kind === 'jurisdiction') return Promise.resolve(false);
    var dir = pack.kind === 'cn' ? 'data/cn/' : 'data/intl/';
    return loadFile(dir + pack.file + '.js').then(function (ok) {
      if (ok) packLoaded[pack.file] = true;
      return ok;
    });
  }

  function load(code) {
    if (!code) return Promise.resolve(false);
    if (loaded[code]) return Promise.resolve(true);
    if (promises[code]) return promises[code];
    promises[code] = inject('data/fulltext/' + code + '.js').then(function () {
      loaded[code] = true;
      return true;
    }, function () {
      failed[code] = true;
      return false;
    });
    return promises[code];
  }


  /* ==================== 译文层（data/trans） ====================
     官方原文只存于 data/fulltext、data/cn、data/intl；
     大模型译文单独存于 data/trans/<pack>.js，通过 CALR_TRANS[lawId] 暴露。
     渲染时按需加载并合并到内存，磁盘上的原文文件始终保持原样。 */
  var transLoaded = {};
  var transMergedMap = {};

  function transManifest() {
    return root.CALR_TRANS_MANIFEST || { version: '1.0.0', files: [], byLaw: {} };
  }

  /** 查询某法规在某目标语言下是否有译文分卷；返回文件名（不含 .js）或 null */
  function transPackFor(lawId, lang) {
    if (!lawId || !lang) return null;
    var e = (transManifest().byLaw || {})[lawId];
    if (!e) return null;
    if (typeof e === 'string') return e;
    return e[lang] || null;
  }

  function transMerged(lawId, lang) {
    return !!transMergedMap[lawId + '|' + lang];
  }

  function transEntry(lawId, lang) {
    var tr = (root.CALR_TRANS || {})[lawId];
    if (!tr) return null;
    if (lang && tr.targetLang && tr.targetLang !== lang) return null;
    return tr;
  }

  /** 把译文合并进已载入的官方条文（仅内存，不落盘） */
  function mergeTrans(lawId, lang) {
    var tr = transEntry(lawId, lang);
    var ft = entry(lawId);
    if (!tr || !ft) return 0;
    /* 原文条号在文内重复（多文件合集）且译文无法对齐的法规：
       译文条号是全局序号，直接按 no 贴会贴错条，故整部跳过合并并留痕。
       判定同时支持两种来源：① 译文自带 numberingConflict 标记
       ② 自动判定（原文条号有重复 且 译文最大条号超过原文最大条号）
       —— 译文分卷会被重新生成，手工标记会丢，必须有自动兜底。 */
    var conflict = !!tr.numberingConflict;
    if (!conflict) {
      var origNos = [], dup = false, seenNo = {};
      (ft.articles || []).forEach(function (a) {
        var n = Number(a.no);
        if (isNaN(n)) return;
        if (seenNo[n]) dup = true;
        seenNo[n] = 1;
        origNos.push(n);
      });
      var maxOrig = origNos.length ? Math.max.apply(null, origNos) : 0;
      var maxTrans = 0;
      (tr.articles || []).forEach(function (a) { maxTrans = Math.max(maxTrans, Number(a.no) || 0); });
      if (dup && maxTrans > maxOrig) conflict = true;
    }
    if (conflict) {
      transMergedMap[lawId + '|' + lang] = true;
      return 0;
    }
    /* 原文条号可能存在重复（多文件合集，用 dupIndex 区分），
       因此必须按 no + dupIndex 组合匹配；只用 no 会让重复条号互相覆盖。
       译文若未带 dupIndex，退化为按 no 匹配（兼容旧译文）。 */
    var byKey = {}, byNo = {};
    (tr.articles || []).forEach(function (a) {
      if (!a || a.no === undefined) return;
      byKey[String(a.no) + '|' + String(a.dupIndex || 1)] = a;
      if (byNo[a.no] === undefined) byNo[a.no] = a;
    });
    var n = 0;
    (ft.articles || []).forEach(function (a) {
      var t = byKey[String(a.no) + '|' + String(a.dupIndex || 1)];
      if (!t) t = byNo[a.no];                 /* 兼容：译文没有 dupIndex 的旧数据 */
      if (!t || !t.text || !t.text[lang]) return;
      a.text = a.text || {};
      a.text[lang] = t.text[lang];
      if (t.heading && t.heading[lang]) { a.heading = a.heading || {}; a.heading[lang] = t.heading[lang]; }
      n++;
    });
    transMergedMap[lawId + '|' + lang] = true;
    return n;
  }

  /** 确保某法规某语种的译文已载入并合并 */
  function ensureTrans(lawId, lang) {
    var pack = transPackFor(lawId, lang);
    if (!pack) return Promise.resolve(false);
    if (transMerged(lawId, lang)) return Promise.resolve(true);
    return loadFile('data/trans/' + pack + '.js').then(function (ok) {
      if (!ok) return false;
      transLoaded[pack] = true;
      mergeTrans(lawId, lang);
      return true;
    });
  }

  function transStats() {
    var m = transManifest();
    var files = m.files || [];
    return {
      packs: files.length,
      laws: Object.keys(m.byLaw || {}).length,
      articles: files.reduce(function (n, f) { return n + (f.articles || 0); }, 0),
      langs: (function () { var o = {}; files.forEach(function (f) { if (f.targetLang) o[f.targetLang] = (o[f.targetLang] || 0) + 1; }); return Object.keys(o); })()
    };
  }

  /** 顺序预加载全部法域全文（容错：缺失文件不报错、不阻塞） */
  function loadAll(onProgress) {
    var files = (manifest().files || []).slice();
    var done = 0;
    return files.reduce(function (chain, code) {
      return chain.then(function () {
        return load(code).then(function () {
          done++;
          if (onProgress) { try { onProgress(done, files.length, code); } catch (e) { /* 忽略 */ } }
        });
      });
    }, Promise.resolve()).then(function () {
      return { loaded: Object.keys(loaded), failed: Object.keys(failed) };
    });
  }

  function entry(lawId) { return (root.CALR_FULLTEXT || {})[lawId] || null; }
  function has(lawId) { return !!entry(lawId); }

  function stats() {
    var all = root.CALR_FULLTEXT || {};
    var laws = Object.keys(all);
    var articles = laws.reduce(function (n, k) { return n + ((all[k].articles || []).length); }, 0);
    return {
      laws: laws.length,
      articles: articles,
      filesLoaded: Object.keys(loaded),
      filesFailed: Object.keys(failed)
    };
  }

  function onChange(fn) { listeners.push(fn); }
  function emit() { listeners.forEach(function (fn) { try { fn(); } catch (e) { /* 忽略 */ } }); }

  CALR.fulltext = {
    load: load,
    loadFile: loadFile,
    ensureLaw: ensureLaw,
    ensureLaws: ensureLaws,
    packFor: packFor,
    loadAll: loadAll,
    entry: entry,
    has: has,
    transPackFor: transPackFor,
    ensureTrans: ensureTrans,
    mergeTrans: mergeTrans,
    transMerged: transMerged,
    transEntry: transEntry,
    transStats: transStats,
    stats: stats,
    onChange: onChange,
    emit: emit
  };
})(typeof window !== 'undefined' ? window : globalThis);
