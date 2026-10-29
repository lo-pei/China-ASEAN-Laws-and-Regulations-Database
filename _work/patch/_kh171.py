# -*- coding: utf-8 -*-
"""KH-H171 教育、青年与体育部设立法 — km → en."""
T = {}


def _a(no, *lines):
    T[str(no)] = "\n".join(lines)


_a(1,
   'The Ministry of Education, Youth and Sport is hereby established under the Royal Government of Cambodia.')

_a(2,
   'The Ministry of Education, Youth and Sport shall have the competence to lead and administer the '
   'education, youth and sport sector of the Kingdom of Cambodia.',
   'Article 3: The Ministry of Education, Youth and Sport shall be led by a Minister, who may be assisted by '
   'Secretaries of State and/or Under-Secretaries of State as necessary.',
   'Article 4: The organisational structure and functioning of the Ministry of Education, Youth and Sport '
   'shall be determined by sub-decree.')

_a(5,
   'All provisions contrary to this Law shall be considered null and void.',
   'Article 6: This Law is declared to be urgent.',
   'Done at Phnom Penh, 24 January 1996; respectfully submitted for the King\u2019s signature: Norodom '
   'Sihanouk; First Prime Minister, Second Prime Minister; Norodom Ranariddh, Hun Sen.')
