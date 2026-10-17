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
      '<div class="container page">' +
        /* 左：模型配置（可选）；右：对话区。页面只保留这两块，聚焦「这是一个对话界面」。 */
        '<div class="layout-sidebar-left is-equal">' +
          '<aside class="col-filter">' +
            byokPanel() +
          '</aside>' +

          '<div>' +
            '<div class="card">' +
              '<div class="card__head">' +
                '<h3 class="card__title">' + esc(t('对话')) + '</h3>' +
                '<span class="tag tag--gold" style="margin-left:auto">' + esc(t('AI 辅助生成，仅供参考')) + '</span>' +
                '<button class="btn btn--ghost btn--sm" id="export-chat">' + esc(t('导出对话（TXT）')) + '</button>' +
                '<button class="btn btn--ghost btn--sm" id="clear-chat">' + esc(t('清空对话')) + '</button>' +
              '</div>' +
              '<div class="card__body">' +
                '<div class="chat" id="chat">' + introBubble() + '</div>' +
                '<div class="chat-input">' +
                  '<textarea id="q-input" rows="2" placeholder="' + esc(t('用自然语言提问，例如：越南外资企业的最低注册资本要求是什么？')) + '" aria-label="' + esc(t('输入问题')) + '"></textarea>' +
                  '<button class="btn" id="ask-btn">' + esc(t('提问')) + '</button>' +
                '</div>' +
                '<p class="mini muted" style="margin:8px 0 0">' + esc(t('提示：本助手仅依据数据库已收录的法规作答；超出收录范围时明确提示“暂未收录相关法规”，不作推测性回答。')) +
                  ' ' + esc(t('对话仅保存在当前页面内存中，刷新或关闭即消失、不上传任何服务器；如需留存请点「导出对话（TXT）」。')) + '</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

      var input = U().$('#q-input', main);

      /* 会话历史（history）是唯一数据源；每次变更都从 history 重绘整个对话区。
         这样即使期间发生过页面重渲染（如切换语言、深链二次渲染），
         答案也不会写进已被替换掉的旧 DOM 节点里。 */
      function chatEl() { return U().$('#chat', main); }
      function renderChat() {
        var el = chatEl();
        if (!el) return;
        el.innerHTML = introBubble() + history.map(function (h) { return h.html; }).join('');
        el.scrollIntoView({ block: 'end' });
      }
      renderChat();

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
            liveBubble.scrollIntoView({ block: 'end' });
          }
          i++;
          setTimeout(step, gap || 110);
        })();
      }

      U().on(U().$('#ask-btn', main), 'click', submit);
      U().on(input, 'keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      });
      U().on(U().$('#clear-chat', main), 'click', function () {
        history = [];
        renderChat();
        U().toast(t('对话已清空'), 'ok');
      });

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
          var res = CALR.qa.ask(question);
          var full = answerHtml(res);
          var plain = plainAnswer(res, null);
          var slot = history.length;
          history.push({ html: rowHtml('ai', '', 'qa-live-row'), role: 'ai', text: plain });
          renderChat();
          setTimeout(function () { streamInto(slot, full, 110); }, 220);
          return;
        }

        /* ---------- 已启用 BYOK：本地检索 + 用户模型改写/生成 + 本地引用校验 ---------- */
        history.push({ html: rowHtml('ai',
          '<span class="mini muted" id="qa-live-note">' + esc(t('正在使用您的模型检索并生成…')) + '</span>' +
          '<div id="qa-live" class="small" style="white-space:pre-wrap;margin-top:6px"></div>', 'qa-live-row') });
        renderChat();

        CALR.qa.askWithLLM(question, {
          onDelta: function (chunk, acc) {
            var live = U().$('#qa-live', main);
            if (live) { live.textContent = acc; live.scrollIntoView({ block: 'end' }); }
          }
        }).then(function (r) {
          history[history.length - 1] = {
            html: answerHtml(r.local, r), role: 'ai', text: plainAnswer(r.local, r)
          };
          renderChat();
        }).catch(function (e) {
          var fallback = CALR.qa.ask(question);
          var fb = { local: fallback, llm: { ok: false, error: String((e && e.message) || e) } };
          history[history.length - 1] = { html: answerHtml(fallback, fb), role: 'ai', text: plainAnswer(fallback, fb) };
          renderChat();
        });
      }
    }
  };

  function introBubble() {
    return rowHtml('ai',
      '<div class="answer-section"><div class="answer-section__title">' + esc(t('我可以帮您做什么')) + '</div>' +
      '<p style="margin:0">' + esc(t('用自然语言描述您的跨境法律问题，我会在数据库中检索相关法条，并给出带溯源的答案。例如：外商投资准入、劳动用工、数据合规、知识产权保护、合同与争端解决。')) + '</p></div>' +
      '<div class="answer-section"><div class="answer-section__title">' + esc(t('回答结构')) + '</div>' +
      '<p style="margin:0">' + esc(t('① 法条概览 → ② 条文要点 → ③ 法条依据（可点击原文）→ ④ 背景说明 → ⑤ 风险与提示。')) + '</p></div>');
  }

  function answerHtml(res, byok) {
    if (!res || res.empty) return '';
    if (!res.inScope) {
      return rowHtml('ai', '<span class="mini muted">' + CALR.ui.icon('check') + ' ' + esc(t('暂未收录相关法规')) + '</span>' +
        '<div class="answer-section"><div class="answer-section__title">' + esc(t('法条概览')) + '</div>' +
          '<p style="margin:0">' + esc(res.answer.overview) + '</p></div>' +
        '<div class="answer-section"><div class="answer-section__title">' + esc(t('建议做法')) + '</div>' +
          '<p style="margin:0">' + esc(res.answer.analysis) + '</p></div>' +
        '<div class="answer-section"><div class="answer-section__title">' + esc(t('风险与提示')) + '</div>' +
          '<p style="margin:0;color:var(--text-secondary)">' + esc(res.answer.risk) + '</p></div>' +
        (res.suggestions && res.suggestions.length
          ? '<div class="answer-section"><div class="answer-section__title">' + esc(t('您是不是想问')) + '</div>' +
            '<div class="row" style="flex-wrap:wrap;gap:8px">' +
            res.suggestions.map(function (q) {
              return '<button type="button" class="btn btn--outline btn--sm" data-ask-again="' + esc(q) + '">' + esc(q) + '</button>';
            }).join('') + '</div></div>'
          : '') +
        '<p class="mini muted" style="margin:10px 0 0">' + CALR.ui.icon('filter') + ' ' + esc(t('检索命中相关度')) + '：' + (res.retrieval ? res.retrieval.topScore.toFixed(1) : '0') +
          '（阈值 ' + CALR.qa.THRESHOLD + '）· ' + esc(t('本次共召回')) + ' ' + (res.retrieval ? res.retrieval.count : 0) + ' ' + esc(t('部法规')) + '</p>');
    }
    /* 命中法规但无结构化条文全文：如实说明，列出命中法规条目，不编造条文 */
    if (res.noFullText) {
      return rowHtml('ai',
        '<div class="answer-section"><div class="answer-section__title">① ' + esc(t('法条概览')) + '</div>' +
          '<p style="margin:0">' + esc(res.answer.overview) + '</p></div>' +
        '<div class="answer-section"><div class="answer-section__title">② ' + esc(t('法条依据')) + '（' + ((res.matchedLaws || []).length) + '）</div>' +
          (res.matchedLaws || []).map(function (l) {
            return '<a class="citation" href="#/law/' + esc(l.lawId) + '">' +
              '<div><span class="citation__no">' + esc(l.countryName) + ' · ' + esc(l.lawTitle) + '</span></div>' +
              '<div class="mini muted" style="margin-top:3px">' + esc(t('该法规暂无结构化条文全文')) + '</div>' +
              '<div class="mini" style="margin-top:3px;color:var(--calr-blue-600)">' + esc(t('查看原文 →')) + '</div></a>';
          }).join('') + '</div>' +
        '<div class="answer-section"><div class="answer-section__title">③ ' + esc(t('建议做法')) + '</div>' +
          '<p style="margin:0">' + esc(res.answer.analysis) + '</p></div>' +
        '<div class="answer-section"><div class="answer-section__title">④ ' + esc(t('风险与提示')) + '</div>' +
          '<p style="margin:0;color:var(--text-secondary)">' + esc(res.answer.risk) + '</p></div>');
    }

    var a = res.answer;
    var llm = byok && byok.llm ? byok.llm : null;
    var llmUsed = !!(llm && llm.ok && llm.text);

    var out = '';

    /* BYOK 未成功时如实告知，并说明已降级（不让用户以为答案来自模型） */
    if (llm && !llmUsed) {
      var why = llm.error || (llm.reason === 'nokey' ? t('未配置 API Key') :
        (llm.reason === 'no-materials' ? t('本地未检索到可引用的条文，已跳过模型调用') : t('模型调用失败')));
      out += '<div class="answer-section"><div class="answer-section__title">⚠ ' + esc(t('模型增强未生效')) + '</div>' +
        '<p style="margin:0;color:var(--text-secondary)" class="small">' + esc(why) +
        '　' + esc(t('已自动降级为本机确定性检索结果，以下内容均来自本地法规库。')) + '</p></div>';
    }

    /* ① 概览：BYOK 成功时用「通过引用校验」的模型答案，否则用本地概览 */
    out += '<div class="answer-section"><div class="answer-section__title">① ' + esc(t('法条概览')) + '</div>' +
      '<p style="margin:0">' + fmtRich(llmUsed ? llm.text : a.overview) + '</p></div>';

    /* ② 条文要点：从召回条文原文抽取，每条绑定引用序号 [n]（A3/A5） */
    if (a.points && a.points.length) {
      out += '<div class="answer-section"><div class="answer-section__title">② ' + esc(t('条文要点')) + '（' + a.points.length + '）</div>' +
        '<ol style="margin:0;padding-left:20px">' +
        a.points.map(function (p) {
          var tip = [p.countryName, p.lawTitle, p.noLabel].filter(Boolean).join(' · ');
          /* 每条要点后挂明确跳转链接：带国别·法规名·条号，点击直接定位到该条并高亮 */
          var href = '#/law/' + esc(p.lawId) + (p.articleId ? '?art=' + esc(p.articleId) : '');
          return '<li style="margin:0 0 9px">' + esc(p.text) +
            '<br><a href="' + href + '" title="' + esc(tip) + '"' +
            ' style="display:inline-block;margin-top:3px;font-size:.85em;color:var(--calr-blue-600);text-decoration:none">' +
            '[' + p.n + '] ' + esc(tip) + ' ↗</a>' +
            '</li>';
        }).join('') + '</ol></div>';
    }

    if (a.basis && a.basis.length) {
      out += '<div class="answer-section"><div class="answer-section__title">③ ' + esc(t('法条依据')) + '（' + a.basis.length + '）</div>' +
        a.basis.map(function (b, i) {
          return '<a class="citation" href="#/law/' + esc(b.lawId) + '?art=' + esc(b.articleId) + '">' +
            '<div><span class="citation__no">[' + (i + 1) + '] ' + esc(b.countryName) + ' · ' + esc(b.lawTitle) + ' ' + esc(b.noLabel) + '</span>' +
            (b.heading ? ' <span class="mini muted">' + esc(b.heading) + '</span>' : '') + '</div>' +
            '<div class="mini muted" style="margin-top:3px">' + esc(b.excerpt) + '</div>' +
            '<div class="mini" style="margin-top:3px;color:var(--calr-blue-600)">' + esc(t('查看原文 →')) + '</div></a>';
        }).join('') + '</div>';
    }

    /* ④ 背景说明：主题通用说明，明确标注「非条文结论」，避免被误读为法条依据 */
    var bg = a.background || a.analysis;
    if (bg) {
      out += '<div class="answer-section"><div class="answer-section__title">④ ' + esc(t('背景说明（非条文结论）')) + '</div>' +
        '<p style="margin:0;color:var(--text-secondary)">' + fmtRich(bg) + '</p></div>';
    }

    out += '<div class="answer-section"><div class="answer-section__title">⑤ ' + esc(t('风险与提示')) + '</div>' +
      '<p style="margin:0;color:var(--text-secondary)">' + fmtRich(a.risk) + '</p></div>';

    /* BYOK 可核查信息：模型、本次 Token 用量、引用校验结果、改写后的检索式 */
    if (llm && llmUsed) {
      var u = llm.usage || {};
      var ver = llm.verification || {};
      var st2 = ver.stats || {};
      out += '<p class="mini muted" style="margin:10px 0 0">' + CALR.ui.icon('sparkle') + ' ' +
        esc(t('本次答案由您的模型生成')) + '：<b>' + esc(llm.model || '') + '</b>' +
        (byok && byok.rewrite && byok.rewrite.ok ? '　' + esc(t('检索式改写')) + '：' + esc(byok.rewrite.query) : '') +
        '</p>' +
        '<p class="mini muted" style="margin:4px 0 0">' +
        esc(t('Token 用量')) + '：' + (u.total_tokens ? esc(String(u.total_tokens)) + '（prompt ' + esc(String(u.prompt_tokens || 0)) + ' / completion ' + esc(String(u.completion_tokens || 0)) + '）' : esc(t('未返回'))) +
        '　' + esc(t('费用以您所选厂商价目表为准，本平台不代收')) +
        '</p>' +
        '<p class="mini muted" style="margin:4px 0 0">' + esc(t('引用校验')) + '：' +
        esc(t('保留可溯源句')) + ' ' + esc(String(st2.keptSubstantive || 0)) + ' / ' + esc(String(st2.substantive || 0)) +
        '，' + esc(t('剔除无引用句')) + ' ' + esc(String(st2.droppedSentences || 0)) +
        (st2.invalidRefs ? '，' + esc(t('越界引用')) + ' ' + esc(String(st2.invalidRefs)) : '') +
        '　' + esc(t('校验由本平台代码执行，非模型自述')) +
        '</p>';
    }

    out += '<p class="mini muted" style="margin:10px 0 0">' + CALR.ui.icon('file') + ' ' + esc(t('本回答共引用')) + ' ' + (res.citations || []).length + ' ' + esc(t('条法条')) +
      '；' + esc(t('检索范围：')) + S().stats().countries + ' ' + esc(t('个法域、')) + S().stats().laws + ' ' + esc(t('部法规')) +
      '。' + esc(t('所有结论均可点击“查看原文”回溯至数据库中的法条。')) + '</p>' +
      '';
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
      if (!cur) cur = 'deepseek';   /* 首次打开默认选中第一个预设，模型与地址自动预填 */
    }
    var defP = null;
    for (var k = 0; k < presets.length; k++) { if (presets[k].id === cur) defP = presets[k]; }
    var modelVal = cfg.model || (defP && defP.model) || '';
    var baseVal = cfg.baseUrl || (defP && defP.baseUrl) || '';
    var temp = typeof cfg.temperature === 'number' ? cfg.temperature : 0.2;

    /* 竖向字段：标签在上、控件满宽，适配 248px 左栏 */
    function v(label, inner) {
      return '<label class="small" style="display:block;margin-top:10px">' + esc(t(label)) +
        '<div style="margin-top:4px">' + inner + '</div></label>';
    }

    return '<div class="card" id="byok-panel">' +
      '<div class="card__head">' +
        '<h3 class="card__title">' + esc(t('模型增强（可选）')) + '</h3>' +
        '<span class="tag ' + (on ? 'tag--blue' : 'tag--outline') + '" style="margin-left:auto">' +
          esc(on ? t('已启用') : t('未启用')) + '</span>' +
      '</div>' +
      '<div class="card__body">' +
        '<p class="mini muted" style="margin:0">' + esc(t('可选：用您自己的大模型 API Key 提升检索改写与答案组织质量，Token 费用由您自付；数据库与检索仍在本机运行，平台不收费、不记录您的 Key。')) + '</p>' +
        (on
          ? '<p class="mini" style="margin:10px 0 0"><b>' + esc(t('当前通道')) + '</b><br>' + esc(llmStatus()) + '</p>' +
            '<div class="row" style="margin-top:10px">' +
              '<button class="btn btn--outline btn--sm" id="byok-toggle" type="button">' + esc(t('修改配置')) + '</button>' +
              '<button class="btn btn--ghost btn--sm" id="byok-off" type="button">' + esc(t('关闭增强')) + '</button>' +
            '</div>' +
            '<div id="byok-body" hidden>' + byokForm() + '</div>'
          : '<div id="byok-body">' + byokForm() + '</div>') +
      '</div>' +
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
