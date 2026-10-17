/* ==========================================================================
   CALR · core/llm.js —— BYOK（Bring Your Own Key）大模型增强通道

   定位：**默认关闭的可选增强**。未配置 Key 时本模块不发起任何网络请求，
        平台保持「零依赖离线、双击即用」的原始形态。
   开启后：只有「用户自己填的 endpoint」会收到请求，且请求体仅含
        经本地库检索出的条文材料与本轮提问；平台数据不出浏览器、
        不经过本项目服务器（本项目没有服务器）。

   协议：仅实现 **OpenAI 兼容** `POST {baseUrl}/chat/completions`
        （DeepSeek / 通义 / 智谱 / 月之暗面 / 硅基流动 / OpenAI / Ollama /
          vLLM / LM Studio / 各类中转站均兼容此协议，一套代码通吃）。

   安全：
     · Key 默认只存 sessionStorage（关闭标签页即失效）
     · 用户显式勾选「记住」才写入 localStorage，并在界面持续警示
     · 发送前由调用方展示目标域名确认
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};

  var SS_KEY = 'calr.llm.session';
  var LS_KEY = 'calr.llm.persist';
  var TIMEOUT_MS = 60000;

  /* 厂商预设：baseUrl + 默认模型 + 常用模型清单（供下拉快捷选择；仍允许手填任意模型名） */
  var PRESETS = [
    { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat',
      models: ['deepseek-chat', 'deepseek-reasoner'] },
    { id: 'qwen', name: '通义千问（阿里云）', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus',
      models: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen-long', 'qwen2.5-72b-instruct', 'qwen2.5-32b-instruct', 'qwen2.5-14b-instruct', 'qwen2.5-7b-instruct'] },
    { id: 'zhipu', name: '智谱 GLM', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash',
      models: ['glm-4-plus', 'glm-4-air', 'glm-4-airx', 'glm-4-flash', 'glm-4-long', 'glm-4v-plus', 'glm-z1-air', 'glm-z1-flash'] },
    { id: 'moonshot', name: '月之暗面 Kimi', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k',
      models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k', 'moonshot-v1-8k-vision-preview', 'kimi-latest'] },
    { id: 'siliconflow', name: '硅基流动', baseUrl: 'https://api.siliconflow.cn/v1', model: 'Qwen/Qwen2.5-7B-Instruct',
      models: ['Qwen/Qwen2.5-7B-Instruct', 'Qwen/Qwen2.5-14B-Instruct', 'Qwen/Qwen2.5-32B-Instruct', 'Qwen/Qwen2.5-72B-Instruct',
               'Qwen/QwQ-32B', 'deepseek-ai/DeepSeek-V3', 'deepseek-ai/DeepSeek-V2.5', 'deepseek-ai/DeepSeek-R1',
               'THUDM/GLM-4-9B-0414', 'THUDM/glm-4-9b-chat', 'internlm/internlm2_5-20b-chat'] },
    { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'o3-mini', 'o1-mini', 'gpt-4-turbo'] },
    { id: 'ollama', name: '本地 Ollama', baseUrl: 'http://localhost:11434/v1', model: 'llama3.1',
      models: ['llama3.1', 'llama3.2', 'qwen2.5', 'qwen2.5-coder', 'mistral', 'gemma2', 'phi4', 'deepseek-r1'] },
    { id: 'custom', name: '自定义（OpenAI 兼容）', baseUrl: '', model: '', models: [] }
  ];


  /** 取某预设的常用模型清单 */
  function modelsOf(presetId) {
    for (var i = 0; i < PRESETS.length; i++) {
      if (PRESETS[i].id === presetId) return PRESETS[i].models || [];
    }
    return [];
  }

  var DEFAULT_CFG = {
    preset: '', baseUrl: '', model: '', apiKey: '', temperature: 0.2,
    remember: false, enabled: false
  };

  function readJson(store, key) {
    try {
      var raw = store.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  /** 读取当前配置（持久化优先，回退会话级） */
  function config() {
    var ls = readJson(root.localStorage, LS_KEY) || readJson(root.sessionStorage, SS_KEY);
    if (!ls) return null;
    var c = {};
    Object.keys(DEFAULT_CFG).forEach(function (k) {
      c[k] = ls[k] === undefined ? DEFAULT_CFG[k] : ls[k];
    });
    return c;
  }

  /** 保存配置：记住 → localStorage，否则 → sessionStorage；两者互斥，避免旧 Key 残留 */
  function save(cfg) {
    var c = {};
    Object.keys(DEFAULT_CFG).forEach(function (k) {
      c[k] = cfg[k] === undefined ? DEFAULT_CFG[k] : cfg[k];
    });
    c.baseUrl = String(c.baseUrl || '').trim().replace(/\/+$/, '');
    c.model = String(c.model || '').trim();
    c.apiKey = String(c.apiKey || '').trim();
    try {
      if (c.remember) {
        root.localStorage.setItem(LS_KEY, JSON.stringify(c));
        root.sessionStorage.removeItem(SS_KEY);
      } else {
        root.sessionStorage.setItem(SS_KEY, JSON.stringify(c));
        root.localStorage.removeItem(LS_KEY);
      }
    } catch (e) { /* 隐私模式下可能不可写，忽略 */ }
    return c;
  }

  function clear() {
    try {
      root.localStorage.removeItem(LS_KEY);
      root.sessionStorage.removeItem(SS_KEY);
    } catch (e) { /* ignore */ }
  }

  function hasKey() {
    var c = config();
    return !!(c && c.apiKey && c.baseUrl && c.model);
  }

  /** 端点域名，用于「发送前确认」提示 */
  function hostOf(baseUrl) {
    var m = String(baseUrl || '').match(/^https?:\/\/([^/]+)/i);
    return m ? m[1] : '';
  }

  /** 把 HTTP / 网络异常归类成用户能看懂的几类 */
  function classifyError(e, res) {
    if (res) {
      if (res.status === 401 || res.status === 403) return { kind: 'auth', status: res.status };
      if (res.status === 429) return { kind: 'rate', status: res.status };
      if (res.status === 404) return { kind: 'endpoint', status: res.status };
      if (res.status >= 500) return { kind: 'server', status: res.status };
      return { kind: 'http', status: res.status };
    }
    var msg = String((e && e.message) || e || '');
    if (/failed to fetch|networkerror|load failed|cors/i.test(msg)) return { kind: 'cors', message: msg };
    if (/abort/i.test(msg)) return { kind: 'abort', message: msg };
    return { kind: 'network', message: msg };
  }

  function errText(kind, detail) {
    var map = {
      auth: 'API Key 无效或无权限（401/403）',
      rate: '请求过于频繁或额度不足（429）',
      endpoint: '接口路径不存在（404），请检查 Base URL 是否为 OpenAI 兼容地址',
      server: '模型服务端错误（5xx），请稍后重试',
      cors: '浏览器跨域被拦截（CORS）。该厂商接口不允许网页直连，请填写你自己搭建的代理地址',
      network: '网络不可达或请求超时',
      abort: '请求已取消',
      http: '接口返回异常'
    };
    return (map[kind] || '调用失败') + (detail ? '：' + detail : '');
  }

  function buildBody(cfg, messages, stream) {
    return JSON.stringify({
      model: cfg.model,
      messages: messages,
      temperature: typeof cfg.temperature === 'number' ? cfg.temperature : 0.2,
      stream: !!stream,
      max_tokens: 1600
    });
  }

  /**
   * 非流式调用（用于「测试连接」与查询改写这类短请求）
   * @returns Promise<{ok, text, usage, error}>
   */
  function complete(cfg, messages, opts) {
    opts = opts || {};
    cfg = cfg || config();
    if (!cfg || !cfg.apiKey) return Promise.resolve({ ok: false, error: '尚未配置 API Key', kind: 'nokey' });

    var ctrl = null, timer = null;
    var init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.apiKey },
      body: buildBody(cfg, messages, false)
    };
    if (root.AbortController) {
      ctrl = new root.AbortController();
      init.signal = ctrl.signal;
    }

    var p = root.fetch(cfg.baseUrl + '/chat/completions', init).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (body) {
          var c = classifyError(null, res);
          c.detail = String(body || '').slice(0, 200);
          return { ok: false, error: errText(c.kind, c.detail), kind: c.kind };
        });
      }
      return res.json().then(function (j) {
        var txt = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
        return { ok: true, text: txt, usage: j.usage || null, model: j.model || cfg.model };
      });
    }).catch(function (e) {
      var c = classifyError(e);
      return { ok: false, error: errText(c.kind, c.message), kind: c.kind };
    });

    if (opts.timeout !== 0) {
      p = new Promise(function (resolve) {
        timer = setTimeout(function () {
          if (ctrl) ctrl.abort();
          resolve({ ok: false, error: errText('network', '超时 ' + TIMEOUT_MS + 'ms'), kind: 'network' });
        }, opts.timeout || TIMEOUT_MS);
        p.then(function (r) { clearTimeout(timer); resolve(r); });
      });
    }
    return p;
  }

  /**
   * 流式调用（用于答案生成）
   * @param cfg 配置
   * @param messages 消息
   * @param onDelta 增量回调 (chunkText, accumulatedText)
   * @returns Promise<{ok, text, usage, error}>
   */
  function stream(cfg, messages, onDelta) {
    cfg = cfg || config();
    if (!cfg || !cfg.apiKey) return Promise.resolve({ ok: false, error: '尚未配置 API Key', kind: 'nokey' });

    var ctrl = null, init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.apiKey },
      body: buildBody(cfg, messages, true)
    };
    if (root.AbortController) { ctrl = new root.AbortController(); init.signal = ctrl.signal; }

    var acc = '', usage = null;

    return root.fetch(cfg.baseUrl + '/chat/completions', init).then(function (res) {
      if (!res.ok || !res.body || !res.body.getReader) {
        if (!res.ok) {
          return res.text().then(function (body) {
            var c = classifyError(null, res);
            return { ok: false, error: errText(c.kind, String(body || '').slice(0, 200)), kind: c.kind };
          });
        }
        /* 无流式能力（如部分代理）：回退整包读取 */
        return res.text().then(function (raw) {
          var txt = extractSseAll(raw);
          if (txt) return { ok: true, text: txt, usage: null };
          try {
            var j = JSON.parse(raw);
            var t = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
            return { ok: true, text: t, usage: j.usage || null };
          } catch (e) { return { ok: false, error: '返回内容无法解析', kind: 'parse' }; }
        });
      }
      var reader = res.body.getReader();
      var dec = new root.TextDecoder('utf-8');
      var buf = '';
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) {
            if (buf.trim()) consumeLine(buf);
            return { ok: true, text: acc, usage: usage };
          }
          buf += dec.decode(r.value, { stream: true });
          var lines = buf.split('\n');
          buf = lines.pop();
          for (var i = 0; i < lines.length; i++) consumeLine(lines[i]);
          return pump();
        });
      }
      function consumeLine(line) {
        var s = String(line || '').trim();
        if (!s || s.indexOf('data:') !== 0) return;
        var payload = s.slice(5).trim();
        if (payload === '[DONE]') return;
        var j;
        try { j = JSON.parse(payload); } catch (e) { return; }
        if (j.usage) usage = j.usage;
        var d = j.choices && j.choices[0];
        if (!d) return;
        var piece = (d.delta && d.delta.content) || '';
        if (piece) {
          acc += piece;
          if (onDelta) { try { onDelta(piece, acc); } catch (e) { /* 渲染异常不影响流 */ } }
        }
      }
      return pump();
    }).catch(function (e) {
      var c = classifyError(e);
      return { ok: false, error: errText(c.kind, c.message), kind: c.kind };
    });
  }

  function extractSseAll(raw) {
    var out = '';
    String(raw || '').split('\n').forEach(function (line) {
      var s = line.trim();
      if (s.indexOf('data:') !== 0) return;
      var p = s.slice(5).trim();
      if (!p || p === '[DONE]') return;
      try {
        var j = JSON.parse(p);
        var d = j.choices && j.choices[0];
        if (d && d.delta && d.delta.content) out += d.delta.content;
      } catch (e) { /* ignore */ }
    });
    return out;
  }

  /** 连接测试：发一次最小请求，区分「CORS / Key 无效 / 端点错误」 */
  function test(cfg) {
    cfg = cfg || config();
    if (!cfg || !cfg.apiKey) return Promise.resolve({ ok: false, error: '请先填写 API Key', kind: 'nokey' });
    if (!cfg.baseUrl) return Promise.resolve({ ok: false, error: '请先填写 Base URL', kind: 'badcfg' });
    if (!cfg.model) return Promise.resolve({ ok: false, error: '请先填写模型名称', kind: 'badcfg' });
    var t0 = Date.now();
    return complete(cfg, [{ role: 'user', content: '你好' }], { timeout: 20000 }).then(function (r) {
      r.latency = Date.now() - t0;
      r.host = hostOf(cfg.baseUrl);
      return r;
    });
  }

  CALR.llm = {
    PRESETS: PRESETS,
    modelsOf: modelsOf,
    config: config,
    save: save,
    clear: clear,
    hasKey: hasKey,
    hostOf: hostOf,
    complete: complete,
    stream: stream,
    test: test
  };
})(typeof window !== 'undefined' ? window : globalThis);
