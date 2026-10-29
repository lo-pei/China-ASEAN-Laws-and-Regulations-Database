# -*- coding: utf-8 -*-
"""KH-H173 关于将白马市改为白马省的王室法令 — km → en."""
T = {}


def _a(no, *lines):
    T[str(no)] = "\n".join(lines)


_a(1,
   'Kep town (Krong Kep) is hereby converted into Kep province (Khet Kep).',
   'Article 2.- The organisational structure and administrative management system of Kep province shall '
   'comply with the Law on the Administrative Management of the Capital, Provinces, Municipalities, '
   'Districts and Khans.',
   '.',
   'Article 3.- All provisions whose content is contrary to this Royal Decree shall be considered null and '
   'void.')

_a(4,
   '- Samdech Akka Moha Sena Padei Techo Hun Sen, Prime Minister of the Kingdom of Cambodia, shall be '
   'responsible for implementing this Royal Decree.')

_a(5,
   '- This Royal Decree shall enter into force from the date of signature.',
   'Signed and sealed at the Royal Palace, Phnom Penh, [date illegible], 2008. Norodom Sihamoni.')
