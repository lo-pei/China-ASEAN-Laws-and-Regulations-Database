# -*- coding: utf-8 -*-
"""柬埔寨语种错标修正：`text.km` 里实为英文的条文搬回 `text.en`。

背景：KH-H007 宪法 169 条的 `text.km` 装的是英文全本；KH-H3894~H3906 等 7 部
「整篇压 1 条」的法典同样把英文本塞在 `km` 字段。若按字段存在性判定，
这些会被当成「高棉文待译」，造成重复劳动。

逐条判定（不按整部），判据：拉丁字母数 ≥ 非空白字符数 × 0.5 且 高棉文字符占比 < 0.3。

用法：python fix_kh_mislabel.py [--dry]
"""
import glob
import io
import json
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
LAWS = os.path.join(ROOT, 'prototype', 'data', 'laws')
BAK = os.path.join(HERE, '_bak_kh_mislabel')

KHMER = re.compile(r'[\u1780-\u17FF\u19E0-\u19FF]')
LATIN = re.compile(r'[A-Za-z]')
# 旧版高棉字体（Limon/ABC-Times）把高棉字形映射到拉丁码位，特征是
# 大量 Latin-1 补充字符（æ ø Ø þ ß é ñ ú ê）+ 词中夹逗号分号
LATIN1_SUP = re.compile(r'[\u00A0-\u00FF]')
EN_WORDS = re.compile(
    r'(?<![A-Za-z])(the|of|and|shall|to|in|be|or|by|for|with|this|that|which|'
    r'person|article|law|kingdom|state|any|from|may|not)(?![A-Za-z])', re.I)


def is_english(s):
    """真英文：ASCII 字母占绝对主导，且能命中常见英文功能词。"""
    if not s.strip():
        return False
    ns = len([c for c in s if not c.isspace()])
    if ns < 40:
        return False
    k = len(KHMER.findall(s))
    l = len(LATIN.findall(s))
    sup = len(LATIN1_SUP.findall(s))
    hits = len(EN_WORDS.findall(s))
    # 拉丁字母占比够高、高棉文极少、Latin-1 补充字符极少、英文功能词密度够
    return (l >= ns * 0.6 and k < ns * 0.05 and sup < ns * 0.02
            and hits >= max(3, ns / 120))


def is_untranslatable(s):
    """旧版高棉字体乱码 / OCR 垃圾：不可直接翻译，需重新抓取。"""
    if not s.strip():
        return False
    ns = len([c for c in s if not c.isspace()])
    if ns < 40:
        return False
    k = len(KHMER.findall(s))
    l = len(LATIN.findall(s))
    sup = len(LATIN1_SUP.findall(s))
    if k >= ns * 0.2:
        return False          # 正常 Unicode 高棉文
    if is_english(s):
        return False
    # 拉丁字母多但命中不了英文，且有 Latin-1 补充字符 → 旧字体乱码
    if l >= ns * 0.3 and sup >= ns * 0.002:
        return True
    # 拉丁字母多、命中不了英文、符号比例高 → OCR 扫描垃圾
    sym = sum(1 for c in s if not c.isalnum() and not c.isspace())
    if l >= ns * 0.3 and sym >= ns * 0.10:
        return True
    return sym >= ns * 0.45


NOTE = ('2026-10-27 语种标注更正：原 `text.km` 内实为英文文本，'
        '已搬至 `text.en`（源库把英文本错存进高棉文字段）。')
NOTE_BAD = ('2026-10-27 源文质量标记：正文为旧版高棉字体（Limon/ABC）映射码位或 OCR 扫描垃圾，'
            '无法直接翻译，需重新抓取官方 Unicode 文本。')

# 启发式覆盖不到的边界条：短碎片、目录点线、混入少量高棉页眉的英文本
FORCE_EN = {('KH-H007', '7'), ('KH-H007', '119'), ('KH-H007', '160')}


def main():
    dry = '--dry' in sys.argv
    if not dry and not os.path.isdir(BAK):
        os.makedirs(BAK)
    total_law = total_art = 0
    bad_law = bad_art = 0
    for fp in sorted(glob.glob(os.path.join(LAWS, 'KH-*.json'))):
        d = json.load(io.open(fp, encoding='utf-8-sig'))
        if d.get('duplicateOf'):
            continue
        lid = os.path.basename(fp)[:-5]
        arts = d.get('articles') or []
        moved = 0
        bad = 0
        for a in arts:
            t = a.get('text')
            if not isinstance(t, dict):
                continue
            km = t.get('km')
            if not km:
                continue
            if str(t.get('en') or '').strip():
                continue
            if is_english(km) or (lid, str(a.get('no'))) in FORCE_EN:
                t['en'] = km
                del t['km']
                moved += 1
            elif is_untranslatable(km):
                bad += 1
        if not moved and not bad:
            continue
        if bad and not moved and bad == len(arts):
            d['textQuality'] = 'legacy-font'
            d['transNote'] = NOTE_BAD
            bad_law += 1
            bad_art += bad
            print('%-11s 整部不可译（%3d 条）  %s' % (
                lid, bad, (d.get('title') or {}).get('zh', '')[:24]))
            if not dry:
                shutil.copy2(fp, os.path.join(BAK, os.path.basename(fp)))
                io.open(fp, 'w', encoding='utf-8', newline='\n').write(
                    json.dumps(d, ensure_ascii=False, indent=1))
            continue
        # 若整部所有条都搬到 en，则 language 改为 en
        remain_km = sum(1 for a in arts
                        if isinstance(a.get('text'), dict) and a['text'].get('km'))
        if moved and remain_km == 0:
            d['language'] = 'en'
        if moved:
            d['transNote'] = NOTE
            total_law += 1
            total_art += moved
        print('%-11s %3d/%3d 条搬至 text.en  language=%s  %s' % (
            lid, moved, len(arts), d.get('language'),
            (d.get('title') or {}).get('zh', '')[:24]))
        if not dry:
            shutil.copy2(fp, os.path.join(BAK, os.path.basename(fp)))
            io.open(fp, 'w', encoding='utf-8', newline='\n').write(
                json.dumps(d, ensure_ascii=False, indent=1))
    print()
    print('%s：搬至 en %d 部 / %d 条；整部不可译 %d 部 / %d 条' % (
        '试运行' if dry else '已落盘', total_law, total_art, bad_law, bad_art))
    if not dry:
        print('备份目录：%s' % BAK)
        print('落盘后须跑 node _work/merge/rebuild-index.js')



if __name__ == '__main__':
    main()
