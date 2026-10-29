# -*- coding: utf-8 -*-
import re
s = 'PRESIDEN REPUBLIK INDONESIA, ttd.'
t = s.strip()
pat_src = "^(PRESIDEN|REPUBLIK INDONESIA|REPUEUK INDONESIA|REPUBUK INDONESIA)[,.]?\\s*(ttd\\.?)?$"
print("pat:", pat_src)
print("match:", bool(re.match(pat_src, t)))
print("search:", bool(re.search(pat_src, t)))
pat2 = r"^(PRESIDEN|REPUBLIK INDONESIA|REPUEUK INDONESIA|REPUBUK INDONESIA)[,.]?\s*(ttd\.?)?$"
print("raw pat:", pat2)
print("match2:", bool(re.match(pat2, t)))
for cand in ["PRESIDEN REPUBLIK INDONESIA, ttd.", "REPUBLIK INDONESIA, ttd.", "PRESIDEN"]:
    print(repr(cand), bool(re.match(pat2, cand)))
