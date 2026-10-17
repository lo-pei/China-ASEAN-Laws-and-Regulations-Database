/* ==========================================================================
   CALR · assets/js/ui/icons.js —— 极简线性图标集
   统一 24×24 viewBox、1.7 描边、圆角端点；仅用 currentColor，随文字与主题变色。
   用法：CALR.ui.icon('search')  或  CALR.ui.icon('download', 16)
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var ui = CALR.ui = CALR.ui || {};

  var P = {
    /* 检索 */
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    /* 官方全文 / 阅读 */
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v13a1.6 1.6 0 0 0-1.6-1.6H4z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v13a1.6 1.6 0 0 1 1.6-1.6H20z"/>',
    /* 待载入 */
    download: '<path d="M12 4v10"/><path d="M8 10.5l4 4 4-4"/><path d="M4.5 19.5h15"/>',
    /* 整理稿 / 文档 */
    file: '<path d="M7 3.5h6.5L19 9v11.5H7z"/><path d="M13.2 3.6V9H19"/><path d="M9.5 13h6M9.5 16.2h6"/>',
    /* 朗读 */
    volume: '<path d="M4.5 9.5h3l4-3.2v11.4l-4-3.2h-3z"/><path d="M15.4 9.2a4 4 0 0 1 0 5.6"/><path d="M17.9 6.8a7.4 7.4 0 0 1 0 10.4"/>',
    /* 打印 / 导出 */
    print: '<path d="M7 9V3.8h10V9"/><rect x="4" y="9" width="16" height="7.5" rx="1.6"/><path d="M7 14h10v6.2H7z"/>',
    /* 清单 / 术语表 */
    list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="M4.6 6.5h.01M4.6 12h.01M4.6 17.5h.01"/>',
    /* 复制引用 */
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 5.5H6.5a2 2 0 0 0-2 2v9"/>',
    /* 条款比对 */
    scales: '<path d="M12 4.5v15"/><path d="M6 19.5h12"/><path d="M4.5 8.5h15"/><path d="M4.5 8.5l-2.2 4.6a2.6 2.6 0 0 0 4.4 0z"/><path d="M19.5 8.5l-2.2 4.6a2.6 2.6 0 0 0 4.4 0z"/>',
    /* 术语 / 语言 */
    globe: '<circle cx="12" cy="12" r="8.2"/><path d="M3.8 12h16.4"/><path d="M12 3.8c2.2 2.3 3.3 5.2 3.3 8.2s-1.1 5.9-3.3 8.2c-2.2-2.3-3.3-5.2-3.3-8.2S9.8 6.1 12 3.8z"/>',
    /* 信息 / 提示 */
    info: '<circle cx="12" cy="12" r="8.2"/><path d="M12 11v5.2"/><path d="M12 7.9h.01"/>',
    /* 警示 */
    alert: '<path d="M12 4.6l8.3 14.4H3.7z"/><path d="M12 10v4"/><path d="M12 16.6h.01"/>',
    /* 生效 / 完成 */
    check: '<path d="M5 12.6l4.3 4.3L19 7.3"/>',
    /* 尚未生效 */
    clock: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.4V12l3.2 2"/>',
    /* 筛选 */
    filter: '<path d="M4 6.4h16"/><path d="M7 12h10"/><path d="M10 17.6h4"/>',
    /* 菜单 */
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    /* 助手 */
    /* 对话 */
    chat: '<path d="M4 6.2A2.2 2.2 0 0 1 6.2 4h11.6A2.2 2.2 0 0 1 20 6.2v8.6a2.2 2.2 0 0 1-2.2 2.2H9.5L4.8 20.4V6.2z"/><path d="M8.2 9.4h7.6M8.2 12.6h5"/>',
    /* 发送 */
    send: '<path d="M20 4L11 13"/><path d="M20 4l-6.2 16-2.8-7-7-2.8z"/>',
    sparkle: '<path d="M12 4.4l1.7 4.5 4.5 1.7-4.5 1.7L12 16.8l-1.7-4.5L5.8 10.6l4.5-1.7z"/><path d="M18.4 15.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/>',
    /* 空态：文档堆 */
    docs: '<path d="M8 5.5h9.5v13H8z"/><path d="M5.5 8.5v10h9"/>',
    /* 外链 */
    external: '<path d="M14 4.5h5.5V10"/><path d="M19.5 4.5L11 13"/><path d="M17.5 14v4.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18.5V8a1.5 1.5 0 0 1 1.5-1.5H10"/>',
    /* 方向 */
    arrowRight: '<path d="M5 12h13"/><path d="M13.5 7.5l4.5 4.5-4.5 4.5"/>',
    chevronRight: '<path d="M9.5 6.5l6 5.5-6 5.5"/>',
    /* 关闭 */
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    /* 法槌（保留一个具象但极简的法域符号） */
    gavel: '<path d="M4 19.5h9"/><path d="M6.5 16.2l7-7"/><path d="M10.4 5.6l4.8 4.8"/><path d="M13.4 3.4l4.8 4.8"/><path d="M15.8 10l3.6 3.6"/>',
    /* 反馈 */
    thumbUp: '<path d="M7.5 10.5L12 4.6l1.1.6a2 2 0 0 1 .9 2.2l-.7 2.6h4.2a1.8 1.8 0 0 1 1.7 2.3l-1.3 5a1.8 1.8 0 0 1-1.7 1.3H7.5z"/><path d="M7.5 10.5H4.4v8.2h3.1z"/>',
    thumbDown: '<path d="M16.5 13.5L12 19.4l-1.1-.6a2 2 0 0 1-.9-2.2l.7-2.6H6.5a1.8 1.8 0 0 1-1.7-2.3l1.3-5A1.8 1.8 0 0 1 7.8 5.4h5.7z"/><path d="M16.5 13.5h3.1V5.3h-3.1z"/>'
  };

  /**
   * 生成图标 SVG
   * 默认不带 width/height，由 CSS 的 `.ico { width:1em; height:1em }` 决定，
   * 使图标自动跟随所在容器的字号（按钮、标签、空态等无需逐个指定尺寸）。
   * @param {string} name  P 中的键
   * @param {number} [size] 需要固定像素尺寸时传入
   * @param {string} [cls]  附加类名
   */
  ui.icon = function (name, size, cls) {
    var d = P[name] || P.info;
    var dim = size ? ' width="' + size + '" height="' + size + '"' : '';
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24"' + dim + ' ' +
      'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + d + '</svg>';
  };

  ui.iconNames = function () { return Object.keys(P); };
})(typeof window !== 'undefined' ? window : globalThis);
