# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "_work/phaseb/embed.py"
s = io.open(p, encoding="utf-8").read()
o = s

# 1) 依赖引导：优先 DirectML 目录（GPU），再退回 CPU 目录
s = s.replace(
'''LIBS = os.path.join(ROOT, "_work", "pylibs")
if LIBS not in sys.path:
    sys.path.insert(0, LIBS)''',
'''# 依赖引导：优先用 DirectML 版 onnxruntime（走 GPU），否则退回 CPU 版
_DML = os.path.join(ROOT, "_work", "pylibs_dml")
_CPU = os.path.join(ROOT, "_work", "pylibs")
if os.path.isdir(_DML):
    sys.path.insert(0, _DML)
if _CPU not in sys.path:
    sys.path.append(_CPU)''')

# 2) 模型加载：GPU 优先，自动回退
s = s.replace(
'''        t0 = time.time()
        self.sess = ort.InferenceSession(
            os.path.join(model_dir, "model.onnx"), so, providers=["CPUExecutionProvider"])''',
'''        t0 = time.time()
        avail = ort.get_available_providers()
        # 优先 GPU（DirectML），失败再退回 CPU
        providers = []
        if "DmlExecutionProvider" in avail:
            providers = ["DmlExecutionProvider", "CPUExecutionProvider"]
        else:
            providers = ["CPUExecutionProvider"]
        try:
            self.sess = ort.InferenceSession(
                os.path.join(model_dir, "model.onnx"), so, providers=providers)
            if len(providers) > 1 and "Dml" not in str(self.sess.get_providers()):
                raise RuntimeError("DirectML 未生效")
        except Exception as e:
            log("  ! GPU 不可用（%s），回退 CPU" % str(e)[:80])
            self.sess = ort.InferenceSession(
                os.path.join(model_dir, "model.onnx"), so,
                providers=["CPUExecutionProvider"])
        log("  实际 provider: %s" % self.sess.get_providers())''')

# 3) batch 上限：4GB 显存用 16 稳，512 token 的条文也不至于 OOM
s = s.replace("MAX_LEN = 512          # bge-m3 支持 8192，但 512 足够法条，且 CPU 快很多\nBATCH = 16             # CPU 上 16 比较稳；内存紧张可降",
              "MAX_LEN = int(os.environ.get(\"CALR_MAX_LEN\") or 512)\nBATCH = int(os.environ.get(\"CALR_BATCH\") or 16)")

if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ embed.py 已改为 GPU 优先")
else:
    print("  ! 锚点未命中")
