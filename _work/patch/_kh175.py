# -*- coding: utf-8 -*-
"""KH-H175 民航秘书处设立法 — km → en."""
T = {}


def _a(no, *lines):
    T[str(no)] = "\n".join(lines)


_a(1,
   '.',
   'The Secretariat of Civil Aviation is hereby established, under the Office of the Council of Ministers and '
   'under the supervision of the Prime Minister.',
   'Article 2.- The Secretariat of Civil Aviation shall have the duty to lead and administer the civil '
   'aviation sector of the Kingdom of Cambodia.')

_a(3,
   '.',
   'The Secretariat of Civil Aviation shall be led by one Under-Secretary of State.',
   'Article 4.- The organisational structure and functioning of the Secretariat of Civil Aviation shall be '
   'determined by sub-decree.')

_a(5,
   '- All provisions contrary to this Law shall be considered null and void.',
   'Article 6.-',
   'This Law is declared to be urgent.',
   'Done at Phnom Penh, 24 [illegible] 1996, having respectfully submitted.',
   'For the King\u2019s signature; First Prime Minister, Second Prime Minister; Norodom Ranariddh, Hun Sen.')
