import sys
sys.path.insert(0, r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\pylibs")
import numpy as np
print("  numpy %s  from %s" % (np.__version__, np.__file__.split("site-packages")[-1][:40]))
import onnxruntime as ort
print("  onnxruntime %s" % ort.__version__)
import tokenizers
print("  tokenizers %s" % tokenizers.__version__)
