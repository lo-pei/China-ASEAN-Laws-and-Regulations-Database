import io, os, shutil, sys
sys.stdout.reconfigure(encoding="utf-8")
BK = os.path.join(os.getcwd(), "_work/fix/law-backup")
LAWS = os.path.join(os.getcwd(), "prototype/data/laws")
n = 0
for f in os.listdir(BK):
    if f.endswith(".json"):
        shutil.copy2(os.path.join(BK, f), os.path.join(LAWS, f))
        n += 1
print("  已恢复 %d 部原始文件" % n)
