# -*- coding: utf-8 -*-
"""评估官方 PDF 的 OCR 文本是否可读（词汇命中率）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))

VOCAB = set("""undang republik indonesia tahun tentang pasal ayat huruf pemerintah presiden
menteri ketentuan bahwa dengan atau dari untuk pada dalam dan yang tidak dapat
sebagaimana dimaksud adalah sebagaimana negara daerah kerja tenaga perusahaan
pekerja buruh perjanjian waktu tertentu pemutusan hubungan pengusaha upah
modal penanaman perusahaan perseroan terbatas hak cipta data pribadi arbitrase
sengketa badan usaha asing perlindungan orang subjek pemilik pengendali
lembaga penyelenggara kewajiban pengawasan sanksi pidana denda penjara
berlaku ditetapkan diundangkan lembaran tambahan nomor tanggal jakarta
pengadilan negeri keputusan penetapan peraturan peralihan penutup
bab bagian paragraf pertama kedua ketiga keempat kelima
""".split())

for f in sorted(os.listdir(SRC)):
    if not f.endswith(".txt") or f.endswith(".raw.txt"):
        continue
    t = open(os.path.join(SRC, f), encoding="utf-8").read()
    words = re.findall(r"[A-Za-z]+", t.lower())
    hit = sum(1 for w in words if w in VOCAB)
    # 乱码字符：非常见符号
    weird = re.findall(r"[|_~^`{}\[\]<>\\]", t)
    print("%-24s words=%7d vocabhit=%5.1f%% weird=%6d (%.3f%%)" % (
        f, len(words), hit / max(1, len(words)) * 100, len(weird), len(weird) / max(1, len(t)) * 100))
    if len(words):
        # 随机取样 3 段，各 250 字符
        for frac in (0.3, 0.6, 0.9):
            i = int(len(t) * frac)
            print("    [%s] %s" % (f, t[i:i + 230].replace("\n", " / ")))
