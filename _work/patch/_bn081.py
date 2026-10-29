# -*- coding: utf-8 -*-
"""BN-H081 自由贸易区（范围宣告）的通知 · 英文补译（1 条 / 5 行）
第 5 行为 58 个界址点坐标串，按规则替换标签、数字原样保留，避免手抄误差。
"""
import io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, '_work', 'patch', 'src', 'BN-H081.json')
_zh = json.load(io.open(SRC, encoding='utf-8'))['articles'][0]['zh'].split('\n')

T = {}

T['1'] = '\n'.join([
    "Free Trade Zone Act, 2014 Free Trade Zone (Declaration of Area) Notification Contents "
    "Article 1 Citation Article 2 Free trade zone "
    "Free Trade Zone Act, 2014 Free Trade Zone (Declaration of Area) Notification "
    "Article 1 Citation This Notification may be cited as the Free Trade Zone (Declaration of Area) Notification.",
    "Article 2 Free trade zone The area set out in Schedule 1 is hereby declared to be a free trade zone, "
    "the boundaries of which are described in the plan set out in Schedule 2.",
    "SCHEDULE 1 (Regulation 2) TERUNJING Industrial Area The \u201cTERUNJING Industrial Area Free Trade Zone\u201d "
    "covers an area of 95 hectares, bounded by the Rimba Highway, the TERUNJING Trunk Road, "
    "the Muara\u2013Tutong Highway and Lambak Village.",
    "The boundary starts at the northernmost corner of the said \u201cTERUNJING Industrial Area Free Trade Zone\u201d, "
    "the coordinates of which are Northing 551744.0000 metres and Easting 584253.0000 metres from "
    "Lamback Village (A), and runs approximately as follows:",
    _zh[4]
    .replace('\u5404\u70b9 \u5317\u8ddd \u4e1c\u8ddd ', 'Point Northing Easting ')
    .replace('\uff08\u4e0e\u5f00\u59cb\u70b9\u7684\u8ddd\u79bb\uff09 ', '(distance from the starting point) ')
    .replace('\u9644\u4ef6 2\uff08\u7b2c 2 \u7f16\uff09 TERUNJING \u5de5\u4e1a\u533a\u81ea\u7531\u8d38\u6613\u533a',
             'SCHEDULE 2 (Regulation 2) TERUNJING Industrial Area Free Trade Zone ')
    .replace('\u672c\u6cd5\u4ee4\u5236\u5b9a\u4e8e\u56de\u5386 1438 \u5e74 11 \u6708 12 \u65e5\uff0c'
             '\u5373\u516c\u5386 2017 \u5e74 8 \u6708 5 \u65e5\u3002',
             'Made this 12th day of the 11th month of 1438 Hijri, corresponding to 5 August 2017.'),
])
