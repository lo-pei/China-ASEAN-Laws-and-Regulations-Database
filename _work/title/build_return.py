#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""按片生成 CALR 标题中译回执：优先取 zh_XXX.py 的人工译法，规则族用固定模板渲染。"""
import importlib
import json
import re
import sys

JOB = 'CALR-TITLE-20261017-1818-SG-2467'
SLICE = '_work/title/jobs/%s/slices/slice_%03d.json'
OUT = '_work/title/returns/%s-RETURN/titles.%03d.json'

COUNTRY = {
    'Belgium': '比利时', 'Bulgaria': '保加利亚', 'Canada': '加拿大', 'China': '中国',
    'Cyprus': '塞浦路斯', 'Czech Republic': '捷克', 'Denmark': '丹麦', 'Egypt': '埃及',
    'Finland': '芬兰', 'France': '法国', 'Georgia': '格鲁吉亚', 'Guernsey': '根西',
    'Hungary': '匈牙利', 'India': '印度', 'Indonesia': '印度尼西亚', 'Ireland': '爱尔兰',
    'Isle of Man': '马恩岛', 'Israel': '以色列', 'Japan': '日本', 'Jersey': '泽西',
    'Kazakhstan': '哈萨克斯坦', 'Latvia': '拉脱维亚', 'Liechtenstein': '列支敦士登',
    'Lithuania': '立陶宛', 'Luxembourg': '卢森堡', 'Malaysia': '马来西亚', 'Malta': '马耳他',
    'Mauritius': '毛里求斯', 'Mexico': '墨西哥', 'Mongolia': '蒙古',
    'Netherlands': '荷兰', 'New Zealand': '新西兰', 'Oman': '阿曼', 'Pakistan': '巴基斯坦',
    'Panama': '巴拿马', 'Papua New Guinea': '巴布亚新几内亚', 'Poland': '波兰',
    'Portugal': '葡萄牙', 'Qatar': '卡塔尔', 'Romania': '罗马尼亚', 'Russia': '俄罗斯',
    'San Marino': '圣马力诺', 'Saudi Arabia': '沙特阿拉伯', 'Seychelles': '塞舌尔',
    'Slovak Republic': '斯洛伐克', 'Slovenia': '斯洛文尼亚', 'South Africa': '南非',
    'Spain': '西班牙', 'Thailand': '泰国', 'Tunisia': '突尼斯', 'Ukraine': '乌克兰',
    'United Arab Emirates': '阿拉伯联合酋长国', 'United Kingdom': '英国',
    'Uruguay': '乌拉圭', 'Vietnam': '越南',
}

NO = r'( \(No\. (\d+)\))?'          # 组：整段、序号


def no_txt(m, i):
    """把 '(No. 4)' 转成 '（第 4 号）'；i 为整段所在组号。"""
    return '（第 %s 号）' % m.group(i + 1) if m.group(i) else ''


def render(en):
    m = re.fullmatch(r'Income Tax \(Singapore — (.+?)\) \(Avoidance of Double Taxation '
                     r'(Agreement|Convention)\) \(Modifications to Implement Multilateral '
                     r'Instrument\) Order (\d{4})', en)
    if m:
        kind = '协定' if m.group(2) == 'Agreement' else '公约'
        return '所得税（新加坡——%s）（避免双重征税%s）（为实施多边文书所作的修改）命令 %s' % (
            COUNTRY[m.group(1)], kind, m.group(3))

    m = re.fullmatch(r'Infrastructure Protection \((Protected Places|Protected Areas)\)'
                     + NO + r' Order (\d{4})', en)
    if m:
        area = '受保护场所' if m.group(1) == 'Protected Places' else '受保护区'
        return '基础设施保护（%s）%s命令 %s' % (area, no_txt(m, 2), m.group(4))

    m = re.fullmatch(r'Housing and Development \(Precincts for Upgrading Works\) '
                     r'\((Home Improvement Programme|Revitalisation of Shops Scheme)\)'
                     + NO + r' Order (\d{4})', en)
    if m:
        prog = '家居改进计划' if m.group(1).startswith('Home') else '商店振兴计划'
        return '建屋发展（升级工程分区）（%s）%s命令 %s' % (prog, no_txt(m, 2), m.group(4))

    m = re.fullmatch(r'Housing and Development \(Precincts for Lift Upgrading Works\)'
                     + NO + r' Order (\d{4})', en)
    if m:
        return '建屋发展（电梯翻新工程分区）%s命令 %s' % (no_txt(m, 1), m.group(3))

    m = re.fullmatch(r'Housing and Development \(Design-Build-and-Sell Scheme — Vesting\)'
                     + NO + r' Notification(?: (\d{4}))?', en)
    if m:
        yr = ' %s' % m.group(3) if m.group(3) else ''
        return '建屋发展（设计—建造—销售计划——归属）%s公告%s' % (no_txt(m, 1), yr)

    m = re.fullmatch(r'Education Endowment and Savings Schemes '
                     r'\(Amount of Edusave Contribution [Ff]or (\d{4})\) Order (\d{4})', en)
    if m:
        return '教育捐赠与储蓄计划（%s 年教育储蓄缴款额）命令 %s' % (m.group(1), m.group(2))

    m = re.fullmatch(r'Employment \(Recommendations for Annual Wage (Adjustment|Increases)\)'
                     + NO + r' Notification (\d{4})', en)
    if m:
        kind = '调整' if m.group(1) == 'Adjustment' else '增长'
        return '雇佣（年度工资%s建议）%s公告 %s' % (kind, no_txt(m, 2), m.group(4))
    return None


def main():
    n = int(sys.argv[1])
    sl = json.load(open(SLICE % (JOB, n), encoding='utf-8'))
    ZH = dict(importlib.import_module('zh_%03d' % n).ZH)
    items, miss = [], []
    for it in sl['items']:
        zh = ZH.pop(it['id'], None) or render(it['en'])
        if not zh:
            miss.append(it['id'])
            zh = ''
        items.append({'id': it['id'], 'zh': zh})
    if miss:
        print('未覆盖 %d 条：%s' % (len(miss), ', '.join(miss[:20])))
        return 1
    if ZH:
        print('多余 id：%s' % ', '.join(list(ZH)[:20]))
        return 1
    out = {'jobId': sl['jobId'], 'shard': sl['shard'], 'items': items}
    with open(OUT % (JOB, n), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print('写出 %s：%d 条' % (OUT % (JOB, n), len(items)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
