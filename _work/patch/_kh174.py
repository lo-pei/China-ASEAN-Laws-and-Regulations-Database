# -*- coding: utf-8 -*-
"""KH-H174 内政部设立法 — km → en."""
T = {}


def _a(no, *lines):
    T[str(no)] = "\n".join(lines)


_a(1,
   "The Ministry of Interior is hereby established under the Royal Government of Cambodia.")

_a(2,
   "The Ministry of Interior shall have the competence to lead and manage the territorial administration at all "
   "levels of the Kingdom of Cambodia, to lead and manage the National Police, to safeguard public order and "
   "security, and to protect the safety of the citizens.")

_a(3,
   "The Ministry of Interior shall be led by a Deputy Prime Minister or a Minister, who may be assisted by "
   "Secretaries of State and/or Under-Secretaries of State as necessary.",
   "Article 4: The organisational structure and functioning of the Ministry of Interior shall be determined by "
   "sub-decree.")

_a(5,
   "Any provisions contrary to this Law shall be considered null and void.")

_a(6,
   "This Law is declared to be urgent. Done at Phnom Penh, 24 January 1996, and respectfully submitted for the "
   "Royal signature; First Prime Minister, Second Prime Minister.")
