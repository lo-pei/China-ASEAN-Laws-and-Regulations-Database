import sys
sys.path.insert(0, r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\pylibs_dml")
sys.path.append(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\pylibs")
import numpy as np
print("  numpy %s" % np.__version__)
import onnxruntime as ort
print("  onnxruntime %s" % ort.__version__)
print("  provider:")
for p in ort.get_available_providers(): print("    - " + p)
