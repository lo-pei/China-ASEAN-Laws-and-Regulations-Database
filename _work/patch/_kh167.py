# -*- coding: utf-8 -*-
"""KH-H167 关于批准 RCEP 协定的王室敕令 No. 1021/010 — km → en."""
T = {}


def _a(no, *lines):
    T[str(no)] = "\n".join(lines)


_a(1,
   'The Regional Comprehensive Economic Partnership Agreement, signed by the Kingdom of Cambodia in Phnom '
   'Penh on 15 November 2020, the full text of which is annexed hereto, is hereby approved.')

_a(2, '-')

_a(3,
   'This Law is declared to be urgent.',
   'Day [illegible] of the waxing moon, B.E. 2565; done at the Royal Palace, 02 [illegible] 2021. Norodom '
   'Sihamoni, having respectfully submitted to the King for signature; Prime Minister, Samdech Akka Moha '
   'Sena Padei Techo Hun Sen.',
   'Having respectfully reported to the Prime Minister and to the Minister of Commerce, Kitti Nitikosol '
   'Bandit Pan Sorasak.')
