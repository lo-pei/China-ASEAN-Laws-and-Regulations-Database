/* ==========================================================================
   CALR · views/assistant.js —— AI 法律问答助手（M6，含幻觉防护与强制溯源）
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var views = CALR.views = CALR.views || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };
  var C = function () { return CALR.ui; };
  var t = function (k) { return CALR.i18n.t(k); };
  var esc = function (s) { return CALR.util.esc(s); };

  /* 用户头像（内联 SVG，图标库无 person 图标） */
  var AVATAR_USER = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5v-1a6.5 6.5 0 0 1 6.5-6.5h2a6.5 6.5 0 0 1 6.5 6.5v1"/></svg>';

  /** 一行对话（左侧 AI 头像 / 右侧用户头像 + 气泡） */
  function rowHtml(role, inner, id) {
    var isUser = role === 'user';
    var av = isUser ? AVATAR_USER : CALR.ui.icon('sparkle');
    return '<div class="chat-row chat-row--' + role + '"' + (id ? ' id="' + id + '"' : '') + '>' +
      '<span class="chat-avatar chat-avatar--' + role + '" aria-hidden="true">' + av + '</span>' +
      '<div class="bubble bubble--' + role + '">' + inner + '</div>' +
      '</div>';
  }

  /* 圈号：用于把「条件：①…；②…；③…」这类长句拆成缩进列表 */
  var CIRC = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳';

  /** 富文本：转义 + **加粗** + 分点自动换行缩进 */
  function fmtRich(text) {
    /* 兜底：数据里若残留免责标记，不在正文中重复展示（卡片头已有常驻标识） */
    var t = esc(String(text == null ? '' : text)
      .replace(/\n?\s*【AI 辅助生成，仅供参考】/g, '')
      .trim());
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return t.split('\n').map(function (ln) {
      var idx = [];
      for (var i = 0; i < ln.length; i++) {
        if (CIRC.indexOf(ln.charAt(i)) >= 0) idx.push(i);
      }
      if (idx.length < 2) return ln;
      var head = ln.slice(0, idx[0]).replace(/[：:]\s*$/, '').trim();
      var parts = idx.map(function (p, k) {
        return ln.slice(p, k + 1 < idx.length ? idx[k + 1] : ln.length).trim();
      }).filter(Boolean);
      return (head ? head + '：<br>' : '') + parts.map(function (p) {
        return '<span style="display:block;padding-left:1.5em">' + p + '</span>';
      }).join('');
    }).join('<br>');
  }

  /** 把结构化答案转成纯文本（供导出 TXT） */
  function plainAnswer(res, byok) {
    if (!res || res.empty) return '';
    var a = res.answer || {};
    var llm = byok && byok.llm;
    var L = [];
    var llmUsed = !!(llm && llm.ok && llm.text);
    L.push(llmUsed ? String(llm.text).trim() : String(a.overview || '').trim());
    if (a.points && a.points.length) {
      L.push('');
      L.push('条文要点：');
      a.points.forEach(function (p, i) {
        L.push('  ' + (i + 1) + '. ' + p.text + '  [' + p.n + '] ' +
          [p.countryName, p.lawTitle, p.noLabel].filter(Boolean).join(' · '));
      });
    }
    if (a.basis && a.basis.length) {
      L.push('');
      L.push('法条依据：');
      a.basis.forEach(function (b, i) {
        L.push('  [' + (i + 1) + '] ' + [b.countryName, b.lawTitle, b.noLabel].filter(Boolean).join(' · ') +
          (b.heading ? '（' + b.heading + '）' : ''));
        if (b.excerpt) L.push('      ' + b.excerpt);
      });
    }
    var bg = a.background || a.analysis;
    if (bg) { L.push(''); L.push('背景说明（非条文结论）：'); L.push(bg); }
    if (a.risk) { L.push(''); L.push('风险与提示：'); L.push(a.risk); }
    if (llm && !llmUsed) {
      var why = llm.error || (llm.reason === 'nokey' ? '未配置 API Key' :
        (llm.reason === 'no-materials' ? '本地未检索到可引用的条文，已跳过模型调用' : '模型调用失败'));
      L.push('');
      L.push('（模型增强未生效：' + why + '，以上内容来自本地法规库）');
    }
    return L.join('\n').replace(/\*\*([^*]+)\*\*/g, '$1');
  }

  var history = [];
  var deepAsked = null;   /* 深链 ?q= 只在同一会话内自动提问一次，避免二次渲染重复追问 */

  /* ============ 多会话历史（仅存当前页面内存，刷新即失） ============ */
  var CONVS = [];          /* [{ id, title, items:[], at }] */
  var convSeq = 0;
  var curConvId = 0;

  /* 会话增强状态：多选、菜单、重命名 */
  var selectMode = false;
  var selected = {};
  var menuId = 0;
  var renamingId = 0;

  /** 时间分组标签（DeepSeek 风格：今天 / 昨天 / 前 7 天 / 更早） */
  function groupLabelOf(c) {
    if (c.pinned) return CALR.i18n.t('置顶');
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var t = c.at || Date.now();
    if (t >= midnight) return CALR.i18n.t('今天');
    if (t >= midnight - 86400000) return CALR.i18n.t('昨天');
    if (t >= midnight - 7 * 86400000) return CALR.i18n.t('前 7 天');
    return CALR.i18n.t('更早');
  }

  function sortedConvs() {
    return CONVS.slice().sort(function (a, b) {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return (b.at || 0) - (a.at || 0);
    });
  }

  function newConv(silent) {
    convSeq++;
    var c = { id: convSeq, title: '', items: [], at: Date.now(), pinned: false };
    CONVS.unshift(c);
    curConvId = c.id;
    return c;
  }
  function curConv() {
    for (var i = 0; i < CONVS.length; i++) if (CONVS[i].id === curConvId) return CONVS[i];
    return newConv(true);
  }
  function convTitleOf(c) {
    if (c.title) return c.title;
    for (var i = 0; i < c.items.length; i++) {
      var it = c.items[i];
      if (it.role === 'user' && it.text) return String(it.text).replace(/\s+/g, ' ').slice(0, 22);
    }
    return CALR.i18n.t('新对话');
  }

  views.assistant = {
    render: function (main, params, query) {
      var st = S().stats();
      /* BYOK 状态：未配置 → 完全离线；已配置且启用 → 走用户自己的模型 */
      var llmCfg = (CALR.llm && CALR.llm.config) ? CALR.llm.config() : null;
      var llmOn = !!(llmCfg && llmCfg.apiKey && llmCfg.baseUrl && llmCfg.model && llmCfg.enabled);
      function llmStatus() {
        if (!llmOn) return t('本地确定性检索（完全离线）');
        return (llmCfg.model || '') + ' · ' + (CALR.llm.hostOf(llmCfg.baseUrl) || '');
      }
      main.innerHTML = '' +
      '<div class="container container--wide page">' +
        '<div class="ai-layout">' +

          /* ---------- 左：历史对话 ---------- */
          '<aside class="ai-history" aria-label="' + esc(t('历史对话')) + '">' +
            '<div class="ai-history__head">' +
              '<span class="ai-history__title">' + esc(t('历史对话')) + '</span>' +
              '<button class="btn btn--outline btn--sm" id="conv-new" type="button" title="' + esc(t('新对话')) + '">＋</button>' +
              '<button class="btn btn--ghost btn--sm" id="conv-select" type="button" title="' + esc(t('多选')) + '">☑</button>' +
            '</div>' +
            '<div class="ai-selbar" id="conv-bar"></div>' +
            '<div class="ai-history__list" id="conv-list"></div>' +
            '<div class="ai-history__foot mini muted">' + esc(t('仅保存在当前页面内存中')) + '</div>' +
          '</aside>' +

          /* ---------- 右：对话 ---------- */
          '<section class="ai-main">' +
            '<div class="ai-main__head">' +
              '<div class="ai-main__title">' +
                CALR.ui.icon('chat') +
                '<span>' + esc(t('AI 法律问答')) + '</span>' +
                '<span class="tag tag--gold">' + esc(t('AI 辅助生成，仅供参考')) + '</span>' +
              '</div>' +
              '<div class="ai-main__actions">' +
                '<button class="btn btn--outline btn--sm" id="byok-open" type="button">' +
                  '<span id="byok-dot" class="ai-dot' + (llmOn ? ' is-on' : '') + '"></span>' +
                  esc(t('API 配置')) +
                  '<span class="ai-main__state" id="byok-state">' + esc(llmOn ? t('已启用') : t('未启用')) + '</span>' +
                '</button>' +
                '<button class="btn btn--ghost btn--sm" id="export-chat" type="button">' + esc(t('导出 TXT')) + '</button>' +
              '</div>' +
            '</div>' +
            '<div class="ai-main__body">' +
              '<div class="chat" id="chat"></div>' +
              '<div class="ai-composer">' +
                '<textarea id="q-input" rows="1" placeholder="' + esc(t('给 CALR AI 发送消息')) + '" aria-label="' + esc(t('输入问题')) + '"></textarea>' +
                '<button class="btn ai-composer__send" id="ask-btn" type="button" title="' + esc(t('提问')) + '">' +
                  CALR.ui.icon('send') + '<span>' + esc(t('提问')) + '</span></button>' +
              '</div>' +
              '<p class="ai-disclaimer mini muted">' +
                esc(t('本助手仅依据数据库已收录的法规作答；超出收录范围时明确提示「暂未收录相关法规」，不作推测性回答。对话不落盘、不上传服务器。')) +
              '</p>' +
            '</div>' +
          '</section>' +
        '</div>' +

        /* ---------- API 配置弹窗 ---------- */
        '<div class="ai-modal" id="byok-modal" hidden>' +
          '<div class="ai-modal__mask" id="byok-mask"></div>' +
          '<div class="ai-modal__panel" role="dialog" aria-modal="true" aria-label="' + esc(t('API 配置')) + '">' +
            '<div class="ai-modal__head">' +
              '<span>' + esc(t('API 配置') ) + '</span>' +
              '<button class="ai-modal__x" id="byok-close" type="button" aria-label="' + esc(t('关闭')) + '">×</button>' +
            '</div>' +
            '<div class="ai-modal__body">' + byokPanel() + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

      var input = U().$('#q-input', main);

      /* 会话历史（history）是唯一数据源；每次变更都从 history 重绘整个对话区。
         这样即使期间发生过页面重渲染（如切换语言、深链二次渲染），
         答案也不会写进已被替换掉的旧 DOM 节点里。 */
      /* 当前会话的 items 就是 chat 的唯一数据源 */
      var history = [];
      function bindConv(c) { curConvId = c.id; history = c.items; }

      /* 首次进入：建一个空会话 */
      if (!CONVS.length) newConv(true);
      bindConv(curConv());

      function menuHtml(c) {
        return '<div class="ai-menu" data-menu="' + c.id + '">' +
          '<button type="button" data-act="pin" data-id="' + c.id + '">' +
            esc(t(c.pinned ? '取消置顶' : '置顶')) + '</button>' +
          '<button type="button" data-act="rename" data-id="' + c.id + '">' + esc(t('重命名')) + '</button>' +
          '<button type="button" class="is-danger" data-act="del" data-id="' + c.id + '">' + esc(t('删除')) + '</button>' +
        '</div>';
      }

      function renderConvList() {
        var box = U().$('#conv-list', main);
        if (!box) return;
        var list = sortedConvs();
        var bar = U().$('#conv-bar', main);
        if (bar) {
          bar.innerHTML = selectMode
            ? '<span class="mini">' + esc(t('已选')) + ' ' + Object.keys(selected).length + '</span>' +
              '<button type="button" class="btn btn--outline btn--sm" data-sel="pin">' + esc(t('置顶')) + '</button>' +
              '<button type="button" class="btn btn--ghost btn--sm" data-sel="del">' + esc(t('删除')) + '</button>' +
              '<button type="button" class="btn btn--ghost btn--sm" data-sel="cancel">' + esc(t('取消')) + '</button>'
            : '';
        }

        /* 按组渲染：置顶优先，其余按今天/昨天/前 7 天/更早 */
        var html = '';
        var lastGroup = null;
        list.forEach(function (c) {
          var g = groupLabelOf(c);
          if (g !== lastGroup) {
            html += '<div class="ai-group">' + esc(g) + '</div>';
            lastGroup = g;
          }
          var on = c.id === curConvId;
          var isSel = !!selected[c.id];
          var title = convTitleOf(c);
          var inner = renamingId === c.id
            ? '<input class="ai-conv__rename" data-rename="' + c.id + '" value="' + esc(title) + '" maxlength="40">'
            : '<span class="ai-conv__title">' + esc(title) + '</span>';
          html += '<div class="ai-conv' + (on ? ' is-active' : '') + (isSel ? ' is-selected' : '') +
              '" data-conv="' + c.id + '">' +
            (selectMode ? '<span class="ai-conv__check">' + (isSel ? '✓' : '') + '</span>' : '') +
            inner +
            (selectMode || renamingId === c.id ? '' :
              '<button class="ai-conv__more" type="button" data-conv-more="' + c.id + '" title="' + esc(t('更多')) + '">⋯</button>') +
            (!selectMode && menuId === c.id ? menuHtml(c) : '') +
          '</div>';
        });
        box.innerHTML = html;

        /* --- 行点击：切换会话 / 多选勾选 --- */
        U().$$('[data-conv]', box).forEach(function (el) {
          U().on(el, 'click', function (e) {
            if (e.target.closest && e.target.closest('[data-conv-more],[data-act],[data-rename]')) return;
            var id = parseInt(el.getAttribute('data-conv'), 10);
            if (selectMode) {
              if (selected[id]) delete selected[id]; else selected[id] = true;
              renderConvList();
              return;
            }
            menuId = 0;
            for (var k = 0; k < CONVS.length; k++) if (CONVS[k].id === id) { bindConv(CONVS[k]); break; }
            renderConvList(); renderChat();
          });
        });

        /* --- ⋯ 菜单开关 --- */
        U().$$('[data-conv-more]', box).forEach(function (el) {
          U().on(el, 'click', function (e) {
            e.stopPropagation();
            var id = parseInt(el.getAttribute('data-conv-more'), 10);
            menuId = (menuId === id) ? 0 : id;
            renderConvList();
          });
        });

        /* --- 菜单动作 --- */
        U().$$('[data-act]', box).forEach(function (el) {
          U().on(el, 'click', function (e) {
            e.stopPropagation();
            var act = el.getAttribute('data-act');
            var id = parseInt(el.getAttribute('data-id'), 10);
            var c = null;
            for (var k = 0; k < CONVS.length; k++) if (CONVS[k].id === id) { c = CONVS[k]; break; }
            if (!c) return;
            if (act === 'pin') {
              c.pinned = !c.pinned;
              U().toast(t(c.pinned ? '已置顶' : '已取消置顶'), 'ok');
            } else if (act === 'rename') {
              renamingId = id;
            } else if (act === 'del') {
              CONVS = CONVS.filter(function (x) { return x.id !== id; });
              delete selected[id];
              if (!CONVS.length) newConv(true);
              if (!CONVS.some(function (x) { return x.id === curConvId; })) bindConv(CONVS[0]);
              else bindConv(curConv());
            }
            menuId = 0;
            renderConvList(); renderChat();
          });
        });

        /* --- 重命名输入框 --- */
        U().$$('[data-rename]', box).forEach(function (el) {
          var id = parseInt(el.getAttribute('data-rename'), 10);
          var c = null;
          for (var k = 0; k < CONVS.length; k++) if (CONVS[k].id === id) { c = CONVS[k]; break; }
          function commit(save) {
            if (save && c) {
              var v = String(el.value || '').trim();
              if (v) c.title = v.slice(0, 40);
            }
            renamingId = 0;
            renderConvList();
          }
          U().on(el, 'keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); commit(true); }
            else if (e.key === 'Escape') { e.preventDefault(); commit(false); }
          });
          U().on(el, 'blur', function () { commit(true); });
          try { el.focus({ preventScroll: true }); el.select(); } catch (err) { el.focus(); }
        });

        /* --- 多选工具条 --- */
        if (bar) {
          U().$$('[data-sel]', bar).forEach(function (el) {
            U().on(el, 'click', function () {
              var act = el.getAttribute('data-sel');
              var ids = Object.keys(selected).map(Number);
              if (act === 'cancel') { selectMode = false; selected = {}; }
              else if (act === 'pin' && ids.length) {
                ids.forEach(function (id) {
                  for (var k = 0; k < CONVS.length; k++) if (CONVS[k].id === id) CONVS[k].pinned = true;
                });
                U().toast(t('已置顶') + ' ' + ids.length + ' ' + t('个对话'), 'ok');
                selected = {}; selectMode = false;
              } else if (act === 'del' && ids.length) {
                CONVS = CONVS.filter(function (x) { return ids.indexOf(x.id) < 0; });
                if (!CONVS.length) newConv(true);
                if (!CONVS.some(function (x) { return x.id === curConvId; })) bindConv(CONVS[0]);
                else bindConv(curConv());
                U().toast(t('已删除') + ' ' + ids.length + ' ' + t('个对话'), 'ok');
                selected = {}; selectMode = false;
              }
              renderConvList(); renderChat();
            });
          });
        }
      }

      /* 顶栏「多选」开关 */
      U().on(U().$('#conv-select', main), 'click', function () {
        selectMode = !selectMode;
        selected = {}; menuId = 0; renamingId = 0;
        U().$('#conv-select', main).classList.toggle('is-active', selectMode);
        renderConvList();
      });

      /* 会话标题随首问更新 */
      function touchConv() {
        var c = curConv();
        if (!c.title) {
          for (var i = 0; i < c.items.length; i++) {
            if (c.items[i].role === 'user' && c.items[i].text) {
              c.title = String(c.items[i].text).replace(/\s+/g, ' ').slice(0, 22);
              break;
            }
          }
        }
        c.at = Date.now();
        renderConvList();
      }

      U().on(U().$('#conv-new', main), 'click', function () {
        newConv();
        bindConv(curConv());
        renderConvList(); renderChat();
        var inp = U().$('#q-input', main);
        /* preventScroll：否则浏览器会把输入框滚入视口，表现为「点新对话页面往下跳」 */
        if (inp) { try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); } }
      });

      /* ---------- API 配置弹窗 ---------- */
      function byokOpen(open) {
        var m = U().$('#byok-modal', main);
        if (!m) return;
        m.hidden = !open;
        document.body.classList.toggle('no-scroll', !!open);
        if (open) { var c = U().$('#byok-close', main); if (c) c.focus(); }
      }
      U().on(U().$('#byok-open', main), 'click', function () { byokOpen(true); });
      U().on(U().$('#byok-close', main), 'click', function () { byokOpen(false); });
      var bmask = U().$('#byok-mask', main);
      if (bmask) U().on(bmask, 'click', function () { byokOpen(false); });
      U().on(document, 'keydown', function (e) {
        if (e.key === 'Escape') { var m = U().$('#byok-modal', main); if (m && !m.hidden) byokOpen(false); }
      });

      function chatEl() { return U().$('#chat', main); }
      function renderChat() {
        var el = chatEl();
        if (!el) return;
        var empty = !history.length;
        var body = el.parentNode;
        if (body && body.classList) body.classList.toggle('is-empty', empty);
        el.innerHTML = empty ? welcomeHtml() : history.map(function (h) { return h.html; }).join('');
        /* 只滚动聊天区自身，不能 scrollIntoView —— 后者会连带滚动整个页面（切会话时页面下跳） */
        if (!empty) el.scrollTop = el.scrollHeight;
      }
      renderChat();
      renderConvList();

      /** 把最终答案 HTML 分段落依次塞进第 slot 条历史记录，模拟流式呈现。
          中途若发生整页重绘（如切换语言），live 节点会失效，此时跳过动画，
          结束时仍会用完整 HTML 回填，保证内容不丢。 */
      function streamInto(slot, fullHtml, gap) {
        var tmp = document.createElement('div');
        tmp.innerHTML = fullHtml;
        var srcBubble = tmp.querySelector('.bubble');
        var kids = srcBubble ? Array.prototype.slice.call(srcBubble.children) : [];
        var live = U().$('#qa-live-row', main);
        var liveBubble = live ? U().$('.bubble', live) : null;
        var i = 0;
        (function step() {
          if (i >= kids.length) {
            var prev = history[slot] || {};
            history[slot] = { html: fullHtml, role: prev.role, text: prev.text };
            if (slot === history.length - 1) renderChat();
            return;
          }
          if (liveBubble && document.body.contains(liveBubble)) {
            liveBubble.appendChild(kids[i].cloneNode(true));
            if (liveBubble.parentNode && liveBubble.parentNode.scrollHeight) { liveBubble.parentNode.scrollTop = liveBubble.parentNode.scrollHeight; }
          }
          i++;
          setTimeout(step, gap || 110);
        })();
      }

      U().on(U().$('#ask-btn', main), 'click', submit);
      U().on(input, 'keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      });
      /* 清空按钮已移到会话列表的删除；此处保留兼容（若存在旧节点） */
      if (U().$('#clear-chat', main)) {
        U().on(U().$('#clear-chat', main), 'click', function () {
          curConv().items.length = 0;
          history = curConv().items;
          renderChat(); renderConvList();
          U().toast(t('对话已清空'), 'ok');
        });
      }

      /* 导出对话为 TXT（含提问与回答全文；不做任何持久化，仅用户主动导出） */
      U().on(U().$('#export-chat', main), 'click', function () {
        var rows = history.filter(function (h) { return h.role; });
        if (!rows.length) { U().toast(t('当前没有可导出的对话'), 'warn'); return; }
        var d = new Date();
        function pad(n) { return (n < 10 ? '0' : '') + n; }
        var stamp = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes());
        var L = [];
        L.push('中国—东盟法律法规数据库（CALR）· AI 法律问答对话记录');
        L.push('导出时间：' + d.toLocaleString());
        L.push('说明：本记录由 AI 辅助生成，仅供参考；正式引用请以各国官方公布文本为准。');
        L.push('分隔线：====================');
        L.push('');
        rows.forEach(function (h, i) {
          L.push((h.role === 'user' ? '【我 · ' : '【AI · ') + (i + 1) + '】');
          L.push(String(h.text || '').trim());
          L.push('');
        });
        U().download('CALR-AI对话-' + stamp + '.txt', L.join('\r\n'), 'text/plain;charset=utf-8');
        U().toast(t('对话已导出为 TXT'), 'ok');
      });

      wireByok();

      /* 婉拒气泡里的「您是不是想问」建议：事件委托，重绘后仍有效 */
      U().on(chatEl(), 'click', function (e) {
        var b = e.target && e.target.closest ? e.target.closest('[data-ask-again]') : null;
        if (b) ask(b.getAttribute('data-ask-again'));
      });

      /* 深链：#/assistant?q=... */
      if (query.q && query.q !== deepAsked) {
        deepAsked = query.q;
        setTimeout(function () { ask(query.q); }, 120);
      }

      function submit() {
        var v = input.value.trim();
        if (!v) { U().toast(t('请输入问题'), 'warn'); return; }
        input.value = '';
        ask(v);
      }

      function ask(question) {
        history.push({ html: rowHtml('user', esc(question)), role: 'user', text: question });
        var typing = rowHtml('ai',
          '<span class="typing"><span></span><span></span><span></span></span> ' +
          esc(t('正在检索数据库并生成答案…')), 'qa-typing');
        var el = chatEl();
        if (el) { el.insertAdjacentHTML('beforeend', typing); el.scrollIntoView({ block: 'end' }); }

        var useLLM = !!(CALR.llm && CALR.llm.hasKey() && (CALR.llm.config() || {}).enabled);

        /* ---------- 未启用 BYOK：完全离线的本地确定性 RAG（行为不变） ---------- */
        if (!useLLM) {
          /* 本地检索是同步的，因此采用「分段落逐节呈现」模拟流式：
             先占位一个空气泡，再把 ① 概览 / ② 要点 / ③ 依据 … 依次塞进去，
             全部完成后用最终 HTML 替换历史条目。 */
          /* P0：askAsync 会先按需加载候选法规的条文分卷，再生成引用；
             加载期间先占位气泡，避免用户以为没反应。 */
          touchConv();
        var slot = history.length;
          history.push({
            html: rowHtml('ai',
              '<span class="mini muted">' + esc(t('正在检索并载入相关条文…')) + '</span>', 'qa-live-row'),
            role: 'ai', text: ''
          });
          renderChat();
          var done = function (res) {
            var full = answerHtml(res);
            var plain = plainAnswer(res, null);
            history[slot] = { html: rowHtml('ai', full), role: 'ai', text: plain };
            renderChat();
          };
          var askP = (CALR.qa.askAsync ? CALR.qa.askAsync(question) : Promise.resolve(CALR.qa.ask(question)));
          askP.then(done).catch(function () { done(CALR.qa.ask(question)); });
          return;
        }

        /* ---------- 已启用 BYOK：本地检索 + 用户模型改写/生成 + 本地引用校验 ---------- */
        history.push({ html: rowHtml('ai',
          '<span class="mini muted" id="qa-live-note">' + esc(t('正在使用您的模型检索并生成…')) + '</span>' +
          '<div id="qa-live" class="small" style="white-space:pre-wrap;margin-top:6px"></div>', 'qa-live-row') });
        renderChat();

        /* P0：先按问题预载候选法规的条文分卷，让 askWithLLM 内部的本地检索
           能命中真正的条文（否则它拿不到可引用条文会直接降级）。 */
        var preload = (CALR.qa.retrieveWithPacks && CALR.fulltext && CALR.fulltext.ensureLaws)
          ? CALR.qa.retrieveWithPacks(question, { packBudget: 6 }).catch(function () { return null; })
          : Promise.resolve(null);

        preload.then(function () { return CALR.qa.askWithLLM(question, {
          onDelta: function (chunk, acc) {
            var live = U().$('#qa-live', main);
            if (live) { live.textContent = acc; live.scrollIntoView({ block: 'end' }); }
          }
        }); }).then(function (r) {
          history[history.length - 1] = {
            html: answerHtml(r.local, r), role: 'ai', text: plainAnswer(r.local, r)
          };
          renderChat();
        }).catch(function (e) {
          var fbRes = { local: CALR.qa.ask(question), llm: { ok: false, error: String((e && e.message) || e) } };
          history[history.length - 1] = {
            html: answerHtml(fbRes.local, fbRes), role: 'ai', text: plainAnswer(fbRes.local, fbRes)
          };
          renderChat();
        });
      }
    }
  };

  /** 落地态：居中欢迎 + 示例问题（替代原来的长引导气泡） */
  function welcomeHtml() {
    var EXAMPLES = [
      ['越南外资企业的最低注册资本要求是什么？', '越南外资最低注册资本'],
      ['泰国劳动法关于经济补偿金怎么规定？', '泰国经济补偿金'],
      ['新加坡公司法的年度申报要求是什么？', '新加坡公司年报'],
      ['中国数据出境需要满足哪些条件？', '中国数据出境']
    ];
    return '<div class="ai-welcome">' +
      '<h2 class="ai-welcome__title">' + esc(t('你好，让我们开始聊天吧')) + '</h2>' +
      '<p class="ai-welcome__sub">' + esc(t('覆盖中国与东盟十国共 12 个法域，回答均带条文溯源。')) + '</p>' +
      '<div class="ai-welcome__chips">' +
        EXAMPLES.map(function (x) {
          return '<button type="button" class="ai-welcome__chip" data-ask-again="' + esc(x[0]) + '">' + esc(t(x[1])) + '</button>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function introBubble() {
    return rowHtml('ai',
      '<div class="answer-section"><div class="answer-section__title">' + esc(t('我可以帮您做什么')) + '</div>' +
      '<p style="margin:0">' + esc(t('用自然语言描述您的跨境法律问题，我会在数据库中检索相关法条，并给出带溯源的答案。例如：外商投资准入、劳动用工、数据合规、知识产权保护、合同与争端解决。')) + '</p></div>' +
      '<div class="answer-section"><div class="answer-section__title">' + esc(t('回答结构')) + '</div>' +
      '<p style="margin:0">' + esc(t('答案正文（带引用编号 [n]）→ 依据列表（点击可回溯法条原文）→ 一行免责；模型与引用校验等技术信息默认折叠。')) + '</p></div>');
  }

  function answerHtml(res, byok) {
    if (!res || res.empty) return '';
    if (!res.inScope) {
      return rowHtml('ai',
        '<p class="ans-note">' + CALR.ui.icon('check') + ' ' + esc(t('暂未收录相关法规')) + '</p>' +
        '<div class="ans-body">' + fmtRich(res.answer.overview) + '</div>' +
        '<p class="ans-foot">' + esc(res.answer.analysis) + '</p>' +
        (res.suggestions && res.suggestions.length
          ? '<div class="ans-refs"><div class="ans-refs__title">' + esc(t('您是不是想问')) + '</div>' +
            '<div class="row" style="flex-wrap:wrap;gap:8px">' +
            res.suggestions.map(function (q2) {
              return '<button type="button" class="btn btn--outline btn--sm" data-ask-again="' + esc(q2) + '">' + esc(q2) + '</button>';
            }).join('') + '</div></div>'
          : ''));
    }
    /* 命中法规但无结构化条文全文：如实说明，列出命中法规条目，不编造条文 */
    if (res.noFullText) {
      var ml = res.matchedLaws || [];
      return rowHtml('ai',
        '<div class="ans-body">' + fmtRich(res.answer.overview) + '</div>' +
        (ml.length
          ? '<div class="ans-refs"><div class="ans-refs__title">' + esc(t('相关法规')) + '（' + ml.length + '）</div>' +
            ml.map(function (l) {
              return '<a class="ans-ref" href="#/law/' + esc(l.lawId) + '">' +
                '<span class="ans-ref__n">·</span>' +
                '<span class="ans-ref__t">' + esc(l.countryName) + ' · ' + esc(l.lawTitle) + '</span>' +
                '<span class="ans-ref__go">' + esc(t('原文')) + ' ↗</span></a>';
            }).join('') + '</div>'
          : '') +
        '<p class="ans-foot">' + CALR.ui.icon('info') + ' ' + esc(t('该法规暂无结构化条文全文')) +
          ' · ' + esc(t('AI 辅助生成，仅供参考')) + '</p>');
    }

    var a = res.answer;
    var llm = byok && byok.llm ? byok.llm : null;
    var llmUsed = !!(llm && llm.ok && llm.text);
    var out = '';

    /* ---- 模型降级提示（仅在已配置但未生效时出现，一行） ---- */
    if (llm && !llmUsed) {
      var why = llm.error || (llm.reason === 'nokey' ? t('未配置 API Key') :
        (llm.reason === 'no-materials' ? t('本地未检索到可引用的条文') : t('模型调用失败')));
      out += '<p class="ans-note">⚠ ' + esc(t('模型增强未生效')) + '：' + esc(why) + '，' + esc(t('以下为本机检索结果')) + '</p>';
    }

    /* ---- 答案正文 ---- */
    var bodyText = llmUsed ? String(llm.text) : String(a.overview || '');
    /* 模型在有材料时仍判「材料不足」属误判：改为提示并回退本地摘要，避免"说没有下面却列了引用"的自相矛盾 */
    if (llmUsed && /材料不足以回答/.test(bodyText) && a.points && a.points.length) {
      bodyText = String(a.overview || '');
      out += '<p class="ans-note">⚠ ' + esc(t('模型认为材料不足，以下为本地检索摘要')) + '</p>';
    }
    /* 本地模式的 overview 里混有流水线状态语（如「已按…筛选，取用重点条文 N 条。以下要点均可在②中逐条溯源。」），
       那是内部提示而非答案，且新版已无「②」小节，故改写为干净引导语 */
    if (!llmUsed) {
      var META_RE = /已按[^。]*筛选[^。]*。|取用重点条文\s*\d+\s*条[^。]*。|以下要点均可在[^。]*溯源[^。]*。/g;
      var cleaned = String(a.overview || '').replace(META_RE, '').replace(/\s+/g, ' ').trim();
      var nPts = (a.points || []).length;
      if (!cleaned && nPts) bodyText = t('据库内') + ' ' + nPts + ' ' + t('条相关条文：');
      else bodyText = cleaned || String(a.overview || '');
    }

    out += '<div class="ans-body">' + fmtRich(bodyText) + '</div>';

    /* ---- 本地模式：补 2–4 条要点 ---- */
    if (!llmUsed && a.points && a.points.length) {
      out += '<ul class="ans-points">' + a.points.slice(0, 4).map(function (p) {
        var tip = [p.countryName, p.lawTitle, p.noLabel].filter(Boolean).join(' · ');
        var href = '#/law/' + esc(p.lawId) + (p.articleId ? '?art=' + esc(p.articleId) : '');
        return '<li>' + esc(p.text) +
          '<a class="ans-points__src" href="' + href + '" title="' + esc(tip) + '">[' + p.n + '] ' + esc(tip) + ' ↗</a>' +
          '</li>';
      }).join('') + '</ul>';
    }

    /* ---- 依据：只列答案中真正引用到的条文 ---- */
    var cits = res.citations || [];
    var used = {};
    if (llmUsed) {
      String(llm.text).replace(/\[(\d{1,2})\]/g, function (m, n) { used[n] = 1; return m; });
    }
    var refs = cits.map(function (c, k) { return { c: c, n: k + 1 }; });
    if (llmUsed && Object.keys(used).length) {
      var picked = refs.filter(function (r) { return used[String(r.n)]; });
      if (picked.length) refs = picked;
    } else if (!llmUsed) {
      refs = refs.slice(0, 4);
    }
    if (refs.length) {
      out += '<div class="ans-refs">' +
        '<div class="ans-refs__title">' + esc(t('依据')) + '（' + refs.length + '）</div>' +
        refs.map(function (r) {
          var b = r.c;
          return '<a class="ans-ref" href="#/law/' + esc(b.lawId) + '?art=' + esc(b.articleId) + '">' +
            '<span class="ans-ref__n">[' + r.n + ']</span>' +
            '<span class="ans-ref__t">' + esc(b.countryName) + ' · ' + esc(b.lawTitle) + ' ' + esc(b.noLabel) + '</span>' +
            '<span class="ans-ref__go">' + esc(t('原文')) + ' ↗</span>' +
          '</a>';
        }).join('') + '</div>';
    }

    /* ---- 一行免责 ---- */
    out += '<p class="ans-foot">' + CALR.ui.icon('info') + ' ' + esc(t('AI 辅助生成，仅供参考')) +
      (refs.length ? ' · ' + esc(t('点击「原文」可回溯法条')) : '') + '</p>';

    /* ---- 技术详情（默认折叠） ---- */
    var tw = [];
    if (llmUsed) {
      var u = llm.usage || {};
      var ver = llm.verification || {};
      var st2 = ver.stats || {};
      tw.push(esc(t('模型')) + '：' + esc(llm.model || ''));
      if (byok && byok.rewrite && byok.rewrite.ok) tw.push(esc(t('检索式')) + '：' + esc(byok.rewrite.query));
      if (u.total_tokens) {
        tw.push(esc(t('Token')) + '：' + esc(String(u.total_tokens)) +
          '（prompt ' + esc(String(u.prompt_tokens || 0)) + ' / completion ' + esc(String(u.completion_tokens || 0)) + '）');
      }
      tw.push(esc(t('引用校验')) + '：' + esc(t('保留可溯源句')) + ' ' + esc(String(st2.keptSubstantive || 0)) + ' / ' +
        esc(String(st2.substantive || 0)) + '，' + esc(t('剔除无引用句')) + ' ' + esc(String(st2.droppedSentences || 0)));
    } else {
      tw.push(esc(t('来源')) + '：' + esc(t('本机确定性检索（未启用模型增强）')));
    }
    tw.push(esc(t('检索范围')) + '：' + S().stats().countries + ' ' + esc(t('个法域、')) + S().stats().laws + ' ' + esc(t('部法规')));
    out += '<details class="ans-tech"><summary>' + esc(t('技术详情')) + '</summary>' +
      tw.map(function (x) { return '<div>' + x + '</div>'; }).join('') + '</details>';

    return rowHtml('ai', out);
  }
  /* ============== BYOK 配置面板（左侧栏，竖向表单，不弹窗） ============== */
  /** 未配置时展开填写；已启用时收起只显示状态，点「修改配置」就地展开 */
  function byokPanel() {
    var cfg = CALR.llm.config() || {};
    var on = !!(cfg.apiKey && cfg.baseUrl && cfg.model && cfg.enabled);
    var presets = CALR.llm.PRESETS;
    var cur = cfg.preset || '';
    if (!cur) {
      if (cfg.baseUrl) {
        for (var i = 0; i < presets.length; i++) {
          if (presets[i].baseUrl && cfg.baseUrl.indexOf(presets[i].baseUrl) === 0) { cur = presets[i].id; break; }
        }
      }
      if (!cur) cur = 'deepseek';
    }
    var defP = null;
    for (var k = 0; k < presets.length; k++) { if (presets[k].id === cur) defP = presets[k]; }
    var modelVal = cfg.model || (defP && defP.model) || '';
    var baseVal = cfg.baseUrl || (defP && defP.baseUrl) || '';
    var temp = typeof cfg.temperature === 'number' ? cfg.temperature : 0.2;

    /* 表单字段：标签在上、控件满宽 */
    function v(label, inner) {
      return '<label class="ai-form__field">' + esc(CALR.i18n.t(label)) +
        '<div class="ai-form__control">' + inner + '</div></label>';
    }

    /* 弹窗内状态行自包含，不依赖 render 作用域的 llmStatus（原实现存在作用域隐雷） */
    var statusLine = on
      ? (cfg.model || '') + ' · ' + (CALR.llm.hostOf(cfg.baseUrl) || '')
      : CALR.i18n.t('本地确定性检索（完全离线）');

    return '<div id="byok-panel">' +
      '<div class="ai-form__status">' +
        '<span class="ai-dot' + (on ? ' is-on' : '') + '"></span>' +
        '<span class="ai-form__status-text">' + esc(statusLine) + '</span>' +
        '<span class="tag ' + (on ? 'tag--blue' : 'tag--outline') + '">' + esc(on ? CALR.i18n.t('已启用') : CALR.i18n.t('未启用')) + '</span>' +
      '</div>' +
      '<p class="mini muted" style="margin:8px 0 14px">' +
        esc(CALR.i18n.t('可选：用您自己的大模型 API Key 提升检索改写与答案组织质量，Token 费用由您自付；数据库与检索仍在本机运行，平台不收费、不记录您的 Key。')) +
      '</p>' +
      (on
        ? '<div class="row" style="margin-bottom:12px">' +
            '<button class="btn btn--outline btn--sm" id="byok-toggle" type="button">' + esc(CALR.i18n.t('修改配置')) + '</button>' +
            '<button class="btn btn--ghost btn--sm" id="byok-off" type="button">' + esc(CALR.i18n.t('关闭增强')) + '</button>' +
          '</div>' +
          '<div id="byok-body" hidden>' + byokForm() + '</div>'
        : '<div id="byok-body">' + byokForm() + '</div>') +
    '</div>';

    /** 该厂商模型清单里是否没有这个模型（→ 视为自定义输入） */
    function isCustomModel(pid, val) {
      var list = (CALR.llm.modelsOf ? CALR.llm.modelsOf(pid) : []) || [];
      return !!val && list.indexOf(val) < 0;
    }

    /** 模型下拉选项：厂商常用模型 + 「自定义（手动输入）」 */
    function modelOptions(pid, val) {
      var list = (CALR.llm.modelsOf ? CALR.llm.modelsOf(pid) : []) || [];
      var custom = isCustomModel(pid, val);
      var out = list.map(function (m) {
        return '<option value="' + esc(m) + '"' + (m === val ? ' selected' : '') + '>' + esc(m) + '</option>';
      }).join('');
      if (!list.length) {
        out = '<option value="">' + esc(t('请选择或自定义模型')) + '</option>' + out;
      }
      out += '<option value="__custom__"' + (custom ? ' selected' : '') + '>' + esc(t('自定义（手动输入）')) + '</option>';
      return out;
    }

    /** 表单主体（首次展开 / 点「修改配置」展开时复用同一段 HTML） */
    function byokForm() {
      return '<div style="margin-top:2px">' +
        v('厂商',
          '<select class="select" id="byok-preset" style="width:100%">' +
            presets.map(function (p) {
              return '<option value="' + esc(p.id) + '"' + (p.id === cur ? ' selected' : '') + '>' + esc(p.name) + '</option>';
            }).join('') +
          '</select>') +
        v('模型名称',
          '<select class="select" id="byok-model" style="width:100%">' + modelOptions(cur, modelVal) + '</select>' +
          '<input class="input" id="byok-model-custom" style="width:100%;margin-top:6px"' + (isCustomModel(cur, modelVal) ? '' : ' hidden') +
          ' value="' + esc(isCustomModel(cur, modelVal) ? modelVal : '') + '" placeholder="' + esc(t('输入自定义模型 ID')) + '">') +
        v('API Key',
          '<input class="input" id="byok-key" type="password" autocomplete="off" spellcheck="false" style="width:100%" value="' + esc(cfg.apiKey || '') + '" placeholder="sk-...">') +
        '<div class="row" style="margin-top:12px;gap:8px">' +
          '<button class="btn btn--sm" id="byok-save" type="button" style="flex:1">' + esc(t('保存并启用')) + '</button>' +
          '<button class="btn btn--outline btn--sm" id="byok-test" type="button">' + esc(t('测试连接')) + '</button>' +
        '</div>' +
        (on ? '<div style="margin-top:8px"><button class="btn btn--ghost btn--sm" id="byok-clear" type="button">' + esc(t('清除配置')) + '</button></div>' : '') +
        '<details style="margin-top:10px">' +
          '<summary class="mini muted" style="cursor:pointer">' + esc(t('高级选项')) + '</summary>' +
          v('接口地址（OpenAI 兼容 Base URL）',
            '<input class="input" id="byok-base" style="width:100%" value="' + esc(baseVal) + '" placeholder="https://api.example.com/v1">') +
          '<label class="small" style="display:block;margin-top:10px">' + esc(t('温度')) +
            ' <b id="byok-temp-v">' + temp + '</b>' +
            '<div style="margin-top:4px"><input id="byok-temp" type="range" min="0" max="1" step="0.1" value="' + temp + '" style="width:100%"></div></label>' +
          '<label class="small" style="display:flex;align-items:flex-start;gap:6px;margin-top:10px">' +
            '<input type="checkbox" id="byok-remember"' + (cfg.remember ? ' checked' : '') + ' style="margin-top:3px">' +
            '<span>' + esc(t('记住此设备')) + '</span></label>' +
        '</details>' +
        '<p class="mini muted" style="margin:10px 0 0">' + esc(t('安全提示：默认仅保存在本次会话，关闭标签页即失效；勾选“记住”才写入浏览器本地存储，请勿在公用电脑使用。API Key 只发送给您填写的接口地址，不经过本平台服务器，本平台也无法读取。')) + '</p>' +
        '<div id="byok-out" class="small" style="margin-top:8px"></div>' +
      '</div>';
    }
  }

  /** 绑定内嵌面板事件 */
  function wireByok() {
    function el(id) { return document.getElementById(id); }
    function val(id) { var e = el(id); return e ? e.value : ''; }
    function say(html) { var o = el('byok-out'); if (o) o.innerHTML = html; }
    function collect() {
      return {
        preset: val('byok-preset'),
        baseUrl: val('byok-base').trim(),
        model: (val('byok-model') === '__custom__' ? val('byok-model-custom') : val('byok-model')).trim(),
        apiKey: val('byok-key').trim(),
        temperature: parseFloat(val('byok-temp')) || 0,
        remember: !!(el('byok-remember') || {}).checked,
        enabled: true
      };
    }

    var toggle = el('byok-toggle'), body = el('byok-body');
    U().on(toggle, 'click', function () {
      if (!body) return;
      body.hidden = !body.hidden;
      toggle.textContent = body.hidden ? t('修改配置') : t('收起配置');
      if (!body.hidden) { var k = el('byok-key'); if (k) k.focus(); }
    });

    U().on(el('byok-preset'), 'change', function (e) {
      var p = null;
      for (var i = 0; i < CALR.llm.PRESETS.length; i++) {
        if (CALR.llm.PRESETS[i].id === e.target.value) p = CALR.llm.PRESETS[i];
      }
      if (!p) return;
      if (p.id !== 'custom') {
        var b = el('byok-base'); if (b) b.value = p.baseUrl;
        var m = el('byok-model'); if (m) m.value = p.model;
      }
      /* 同步刷新「模型名称」下拉选项 */
      var msel = el('byok-model');
      if (msel) {
        var list = (CALR.llm.modelsOf ? CALR.llm.modelsOf(p.id) : []) || [];
        msel.innerHTML = list.map(function (x) {
          return '<option value="' + esc(x) + '">' + esc(x) + '</option>';
        }).join('') + '<option value="__custom__">' + esc(t('自定义（手动输入）')) + '</option>';
        if (list.length) msel.value = list[0];
      }
      var cin = el('byok-model-custom');
      if (cin) cin.hidden = true;
    });

    /* 选中「自定义」时显示手动输入框 */
    U().on(el('byok-model'), 'change', function (e) {
      var cin = el('byok-model-custom');
      if (!cin) return;
      cin.hidden = e.target.value !== '__custom__';
      if (!cin.hidden) cin.focus();
    });

    U().on(el('byok-temp'), 'input', function (e) {
      var v = el('byok-temp-v'); if (v) v.textContent = e.target.value;
    });

    U().on(el('byok-test'), 'click', function () {
      var c = collect();
      if (!c.baseUrl || !c.model || !c.apiKey) {
        say('<span class="muted">' + esc(t('请先填写接口地址、模型名称与 API Key')) + '</span>'); return;
      }
      var host = CALR.llm.hostOf(c.baseUrl);
      say('<span class="muted">' + esc(t('正在连接')) + ' <b>' + esc(host) + '</b> …</span>');
      CALR.llm.test(c).then(function (r) {
        if (r.ok) {
          say('<b>✓ ' + esc(t('连接成功')) + '</b> · ' + esc(r.model || c.model) + ' · ' + r.latency + 'ms' +
            '<br><span class="mini muted">' + esc(t('返回')) + '：' + esc(U().truncate(r.text || '', 60)) + '</span>');
        } else {
          say('<b>✗ ' + esc(r.error || t('连接失败')) + '</b>');
        }
      });
    });

    U().on(el('byok-save'), 'click', function () {
      var c = collect();
      if (!c.apiKey) { say('<span class="muted">✗ ' + esc(t('请填写 API Key')) + '</span>'); return; }
      if (!c.baseUrl) { say('<span class="muted">✗ ' + esc(t('请填写接口地址')) + '</span>'); return; }
      if (!c.model) { say('<span class="muted">✗ ' + esc(t('请填写模型名称')) + '</span>'); return; }
      CALR.llm.save(c);
      U().toast(t('已保存并启用模型增强'), 'ok');
      CALR.app.refresh();
    });

    U().on(el('byok-clear'), 'click', function () {
      CALR.llm.clear();
      U().toast(t('已清除模型配置'), 'ok');
      CALR.app.refresh();
    });

    U().on(el('byok-off'), 'click', function () {
      var c = CALR.llm.config() || {};
      c.enabled = false;
      CALR.llm.save(c);
      U().toast(t('已关闭模型增强'), 'ok');
      CALR.app.refresh();
    });
  }

})(typeof window !== 'undefined' ? window : globalThis);
