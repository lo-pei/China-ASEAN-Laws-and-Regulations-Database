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

  var history = [];

  views.assistant = {
    render: function (main, params, query) {
      var st = S().stats();
      main.innerHTML = '' +
      '<div class="container page">' +
        '<div class="page-head"><h1>' + esc(t('AI 法律问答助手')) + '</h1>' +
          '<p class="page-head__desc">' + esc(t('基于数据库内权威法规的检索增强生成（Retrieval-Augmented Generation, RAG）：先检索法条、再生成答案，每条结论均附法条原文链接，可逐条溯源。')) + '</p></div>' +

        '<div class="layout-2col">' +
          '<div>' +
            '<div class="card">' +
              '<div class="card__head">' +
                '<h3 class="card__title">' + esc(t('问答')) + '</h3>' +
                '<span class="tag tag--gold" style="margin-left:auto">' + esc(t('AI 辅助生成，仅供参考')) + '</span>' +
                '<button class="btn btn--ghost btn--sm" id="clear-chat">' + esc(t('清空对话')) + '</button>' +
              '</div>' +
              '<div class="card__body">' +
                '<div class="chat" id="chat">' + introBubble() + '</div>' +
                '<div class="qa-suggest" style="margin:14px 0 10px" id="suggest">' +
                  CALR.qa.suggestions().map(function (q) { return '<button type="button" data-ask="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') +
                '</div>' +
                '<div class="chat-input">' +
                  '<textarea id="q-input" rows="2" placeholder="' + esc(t('用自然语言提问，例如：越南外资企业的最低注册资本要求是什么？')) + '" aria-label="' + esc(t('输入问题')) + '"></textarea>' +
                  '<button class="btn" id="ask-btn">' + esc(t('提问')) + '</button>' +
                '</div>' +
                '<p class="mini muted" style="margin:8px 0 0">' + esc(t('提示：本助手仅依据数据库已收录的法规作答；超出收录范围时明确提示“暂未收录相关法规”，不作推测性回答。')) + '</p>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<aside class="col-sidebar">' +
            '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('检索范围')) + '</h3></div>' +
              '<div class="card__body"><div class="grid grid--2">' +
                C().stat(st.countries, t('法域')) + C().stat(st.laws, t('法规与文件（部）')) +
                C().stat(st.articles, t('条文（条）')) + C().stat(st.terms, t('术语（条）')) +
              '</div><p class="mini muted" style="margin:0">' + esc(t('语料库口径：东盟法律行业语料库已汇聚 7 种语言、10 万余部法规、超 5 亿字；已完成百余部重点法规翻译，形成 300 余万字平行语料。')) + '</p></div>' +
            '</div>' +

            '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('幻觉防护机制')) + '</h3></div>' +
              '<div class="card__body"><ul class="small muted" style="padding-left:16px;margin:0">' +
                '<li>' + esc(t('答案仅在检索到相关法条后生成，无依据不作答；')) + '</li>' +
                '<li>' + esc(t('每条结论附法条原文链接与国别、文号、条号；')) + '</li>' +
                '<li>' + esc(t('引用原文与生成结论分区展示，避免混淆；')) + '</li>' +
                '<li>' + esc(t('超出收录范围时明确提示“暂未收录相关法规”；')) + '</li>' +
                '<li>' + esc(t('所有内容标注“AI 辅助生成，仅供参考”。')) + '</li>' +
              '</ul></div>' +
            '</div>' +

            '<div class="card"><div class="card__head"><h3 class="card__title">' + esc(t('多语种支持')) + '</h3></div>' +
              '<div class="card__body"><p class="small muted" style="margin:0">' +
                esc(t('支持中文、英文及东盟主要语种的提问与检索；界面语言切换见顶部工具栏。当前语料以中文与英文为主，东盟语种原文通过跨语言召回定位后附原文对照。')) +
              '</p><div class="row" style="margin-top:8px">' + CALR.i18n.langs().map(function (l) {
                return '<span class="tag tag--outline">' + esc(l.native) + '</span>';
              }).join('') + '</div></div>' +
            '</div>' +
          '</aside>' +
        '</div>' +
      '</div>';

      var chat = U().$('#chat', main);
      var input = U().$('#q-input', main);

      /* 载入历史（同一会话内切换页面保留） */
      history.forEach(function (h) { chat.insertAdjacentHTML('beforeend', h.html); });

      U().on(U().$('#ask-btn', main), 'click', submit);
      U().on(input, 'keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      });
      U().$$('[data-ask]', main).forEach(function (b) {
        U().on(b, 'click', function () { ask(b.getAttribute('data-ask')); });
      });
      U().on(U().$('#clear-chat', main), 'click', function () {
        history = [];
        chat.innerHTML = introBubble();
        U().toast(t('对话已清空'), 'ok');
      });

      /* 深链：#/assistant?q=... */
      if (query.q) setTimeout(function () { ask(query.q); }, 120);

      function submit() {
        var v = input.value.trim();
        if (!v) { U().toast(t('请输入问题'), 'warn'); return; }
        input.value = '';
        ask(v);
      }

      function ask(question) {
        pushUser(question);
        var typing = document.createElement('div');
        typing.className = 'bubble bubble--ai';
        typing.innerHTML = '<span class="typing"><span></span><span></span><span></span></span> ' + esc(t('正在检索数据库并生成答案…'));
        chat.appendChild(typing);
        chat.scrollIntoView({ block: 'end' });

        setTimeout(function () {
          var res = CALR.qa.ask(question);
          typing.parentNode.removeChild(typing);
          var html = answerHtml(res);
          chat.insertAdjacentHTML('beforeend', html);
          history.push({ html: html });
          chat.scrollIntoView({ block: 'end' });
        }, 520);
      }

      function pushUser(question) {
        var html = '<div class="bubble bubble--user">' + esc(question) + '</div>';
        chat.insertAdjacentHTML('beforeend', html);
        history.push({ html: html });
      }
    }
  };

  function introBubble() {
    return '<div class="bubble bubble--ai">' +
      '<span class="bubble__ai-badge">' + CALR.ui.icon('sparkle') + ' ' + esc(t('AI 辅助生成，仅供参考')) + '</span>' +
      '<div class="answer-section"><div class="answer-section__title">' + esc(t('我可以帮您做什么')) + '</div>' +
      '<p style="margin:0">' + esc(t('用自然语言描述您的跨境法律问题，我会在数据库中检索相关法条，并给出带溯源的答案。例如：外商投资准入、劳动用工、数据合规、知识产权保护、合同与争端解决。')) + '</p></div>' +
      '<div class="answer-section"><div class="answer-section__title">' + esc(t('回答结构')) + '</div>' +
      '<p style="margin:0">' + esc(t('① 法条概览（结论要点）→ ② 法条依据（可点击原文）→ ③ 专业解析 → ④ 风险与提示。')) + '</p></div>' +
      '</div>';
  }

  function answerHtml(res) {
    if (!res || res.empty) return '';
    if (!res.inScope) {
      return '<div class="bubble bubble--ai">' +
        '<span class="bubble__ai-badge">' + CALR.ui.icon('check') + ' ' + esc(t('暂未收录相关法规')) + '</span>' +
        '<div class="answer-section"><div class="answer-section__title">' + esc(t('法条概览')) + '</div>' +
          '<p style="margin:0">' + esc(res.answer.overview) + '</p></div>' +
        '<div class="answer-section"><div class="answer-section__title">' + esc(t('建议做法')) + '</div>' +
          '<p style="margin:0">' + esc(res.answer.analysis) + '</p></div>' +
        '<div class="answer-section"><div class="answer-section__title">' + esc(t('风险与提示')) + '</div>' +
          '<p style="margin:0;color:var(--text-secondary)">' + esc(res.answer.risk) + '</p></div>' +
        '<p class="mini muted" style="margin:10px 0 0">' + CALR.ui.icon('filter') + ' ' + esc(t('检索命中相关度')) + '：' + (res.retrieval ? res.retrieval.topScore.toFixed(1) : '0') +
          '（阈值 ' + CALR.qa.THRESHOLD + '）· ' + esc(t('本次共召回')) + ' ' + (res.retrieval ? res.retrieval.count : 0) + ' ' + esc(t('部法规')) + '</p>' +
        '</div>';
    }
    var a = res.answer;
    var out = '<div class="bubble bubble--ai">' +
      '<span class="bubble__ai-badge">' + CALR.ui.icon('sparkle') + ' ' + esc(res.disclaimer) + '</span>';

    out += '<div class="answer-section"><div class="answer-section__title">① ' + esc(t('法条概览')) + '</div>' +
      '<p style="margin:0">' + esc(a.overview) + '</p></div>';

    if (a.basis && a.basis.length) {
      out += '<div class="answer-section"><div class="answer-section__title">② ' + esc(t('法条依据')) + '（' + a.basis.length + '）</div>' +
        a.basis.map(function (b) {
          return '<a class="citation" href="#/law/' + esc(b.lawId) + '?art=' + esc(b.articleId) + '">' +
            '<div><span class="citation__no">' + esc(b.countryName) + ' · ' + esc(b.lawTitle) + ' ' + esc(b.noLabel) + '</span>' +
            (b.heading ? ' <span class="mini muted">' + esc(b.heading) + '</span>' : '') + '</div>' +
            '<div class="mini muted" style="margin-top:3px">' + esc(b.excerpt) + '</div>' +
            '<div class="mini" style="margin-top:3px;color:var(--calr-blue-600)">' + esc(t('查看原文 →')) + '</div></a>';
        }).join('') + '</div>';
    }

    out += '<div class="answer-section"><div class="answer-section__title">③ ' + esc(t('专业解析')) + '</div>' +
      '<p style="margin:0">' + esc(a.analysis) + '</p></div>';

    out += '<div class="answer-section"><div class="answer-section__title">④ ' + esc(t('风险与提示')) + '</div>' +
      '<p style="margin:0;color:var(--text-secondary)">' + esc(a.risk) + '</p></div>';

    out += '<p class="mini muted" style="margin:10px 0 0">' + CALR.ui.icon('file') + ' ' + esc(t('本回答共引用')) + ' ' + (res.citations || []).length + ' ' + esc(t('条法条')) +
      '；' + esc(t('检索范围：')) + S().stats().countries + ' ' + esc(t('个法域、')) + S().stats().laws + ' ' + esc(t('部法规')) +
      '。' + esc(t('所有结论均可点击“查看原文”回溯至数据库中的法条。')) + '</p>' +
      '<div class="row" style="margin-top:8px">' +
        '<button class="btn btn--ghost btn--sm" onclick="alert(\'' + esc(t('已记录您的反馈，将用于优化检索与生成质量。')) + '\')">' + CALR.ui.icon('thumbUp') + ' ' + esc(t('有帮助')) + '</button>' +
        '<button class="btn btn--ghost btn--sm" onclick="alert(\'' + esc(t('已记录您的反馈，将用于优化检索与生成质量。')) + '\')">' + CALR.ui.icon('thumbDown') + ' ' + esc(t('需改进')) + '</button>' +
      '</div>';
    return out + '</div>';
  }
})(typeof window !== 'undefined' ? window : globalThis);
