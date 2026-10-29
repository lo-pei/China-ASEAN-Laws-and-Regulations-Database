# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "tools/verify-data-home.js"
s = io.open(p, encoding="utf-8").read()
anchor = "/* ============ A8：不引用 prototype/ 之外的数据 ============ */"
add = '''/* ============ A9/A10/A11：标题译名归档 ============ */
const TZDIR = path.join(PROTO, 'data/title-zh');
if (!fs.existsSync(TZDIR)) {
  E('A9 缺少 prototype/data/title-zh/（法规标题中译归档目录）');
} else {
  let tzIdx = null;
  try { tzIdx = JSON.parse(fs.readFileSync(path.join(TZDIR, 'index.json'), 'utf8')); }
  catch (e) { E('A9 title-zh/index.json 解析失败: ' + e.message); }

  /* 统计 laws/ 实际中文标题数 */
  let lawZh = 0;
  const zhMap = new Map();
  for (const f of lawFiles) {
    let o; try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
    const z = (o.title || {}).zh;
    if (z) { lawZh++; zhMap.set(o.id, z); }
  }

  if (tzIdx) {
    if (tzIdx.translatedCount !== lawZh)
      E('A9 index.json translatedCount=' + tzIdx.translatedCount + ' ≠ laws/ 实际 ' + lawZh);
    else ok('A9 标题译名计数一致（' + lawZh + '）');
  }

  /* A10 titles.zh.json 与 laws/ 逐条一致 */
  const tzf = path.join(TZDIR, 'titles.zh.json');
  if (!fs.existsSync(tzf)) {
    E('A10 缺少 title-zh/titles.zh.json');
  } else {
    let ex = null;
    try { ex = JSON.parse(fs.readFileSync(tzf, 'utf8')); }
    catch (e) { E('A10 titles.zh.json 解析失败: ' + e.message); }
    if (ex) {
      const rows = ex.titles || {};
      let mismatch = 0, extra = 0;
      for (const [id, r] of Object.entries(rows)) {
        if (!zhMap.has(id)) { extra++; if (extra <= 5) E('A10 titles.zh.json 含 laws/ 无中文标题的 id: ' + id); continue; }
        if (zhMap.get(id) !== r.zh) { mismatch++; if (mismatch <= 5) E('A10 ' + id + ' 译名与 laws/ 不一致'); }
      }
      let missing = 0;
      for (const id of zhMap.keys()) if (!rows[id]) { missing++; if (missing <= 5) E('A10 titles.zh.json 缺 ' + id); }
      if (!mismatch && !missing && !extra) ok('A10 titles.zh.json 与 laws/ 逐条一致（' + lawZh + ' 条）');
    }
  }

  /* A11 artifacts 非空 */
  const artDir = path.join(TZDIR, 'artifacts');
  if (!fs.existsSync(artDir)) E('A11 缺少 title-zh/artifacts/');
  else {
    const n = fs.readdirSync(artDir).length;
    n ? ok('A11 artifacts/ 含 ' + n + ' 项') : E('A11 title-zh/artifacts/ 为空');
  }
}

'''
if "A9 缺少 prototype/data/title-zh" in s:
    print("  - 已存在")
else:
    s = s.replace(anchor, add + anchor, 1)
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ verify-data-home.js 已加 A9/A10/A11")
# 汇总里加一行
s2 = io.open(p, encoding="utf-8").read()
s2 = s2.replace("  console.log('  通过检查项    : ' + oks);",
                "  console.log('  标题译名      : ' + (fs.existsSync(path.join(PROTO,'data/title-zh')) ? '已归档 prototype/data/title-zh/' : '未归档'));\n  console.log('  通过检查项    : ' + oks);")
io.open(p, "w", encoding="utf-8").write(s2)
print("  ✓ 汇总输出已加标题译名一行")
