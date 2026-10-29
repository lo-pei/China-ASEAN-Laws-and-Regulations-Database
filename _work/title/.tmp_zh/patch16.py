import re, io, sys
sys.path.insert(0, '_work/title/.tmp_zh')
import eval16
rep = eval16.C
p = '_work/title/.tmp_zh/z16.py'
s = open(p, encoding='utf-8').read()
for k, v in rep.items():
    s, n = re.subn(r'^"%s": ".*",$' % k, '"%s": "%s",' % (k, v), s, flags=re.M)
    if n != 1:
        print('MISS', k, n)
open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('patched', len(rep))
