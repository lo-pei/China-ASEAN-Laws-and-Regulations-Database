import sys, os
sys.path.insert(0, r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\pylibs_dml")
import onnxruntime as ort
print("  onnxruntime %s" % ort.__version__)
print("  可用 provider:")
for p in ort.get_available_providers(): print("    - " + p)
