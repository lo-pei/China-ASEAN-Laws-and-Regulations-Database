# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

# ---- 1) main.py：/api/search 支持 hybrid，并新增 /api/vectors 状态 ----
p = "backend/app/main.py"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace("from . import db, search as search_mod",
              "from . import db, search as search_mod, vectors as vec_mod, hybrid as hybrid_mod, embedder")
s = s.replace('mode: str = Query("keyword", pattern="^(keyword|semantic|exact)$"),',
              'mode: str = Query("keyword", pattern="^(keyword|semantic|exact|hybrid)$"),')
s = s.replace('''    return search_mod.search(q=q, mode=mode, country=country, level=level,
                             status=status, page=page, size=size)''',
'''    if mode == "hybrid":
        return hybrid_mod.hybrid_search(q=q, mode="hybrid", country=country,
                                        level=level, status=status,
                                        page=page, size=size)
    return search_mod.search(q=q, mode=mode, country=country, level=level,
                             status=status, page=page, size=size)''')
# 新增向量状态接口
s = s.replace('''@app.get("/api/search/articles"''',
'''@app.get("/api/vectors", summary="向量索引状态")
def vectors_status() -> Dict[str, Any]:
    return {"embeddings": vec_mod.info(), "model": embedder.available(),
            "modelDir": embedder.DEFAULT_MODEL}


@app.get("/api/search/articles"''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ main.py 已接入 hybrid 与 /api/vectors")
else:
    print("  ! main.py 锚点未命中")

# ---- 2) requirements.txt ----
p2 = "backend/requirements.txt"
s2 = io.open(p2, encoding="utf-8").read()
if "onnxruntime" not in s2:
    s2 = """# CALR 后端依赖
# Phase A：API 与 BM25
fastapi>=0.110
uvicorn[standard]>=0.27
httpx>=0.27
# Phase B：向量检索（bge-m3 走 ONNX）
# GPU（DirectML，Windows 上任何 DX12 显卡可用，无需装 CUDA）：
onnxruntime-directml>=1.17 ; sys_platform == "win32"
# 纯 CPU / Linux 服务器：
onnxruntime>=1.17 ; sys_platform != "win32"
tokenizers>=0.15
numpy>=1.26
"""
    io.open(p2, "w", encoding="utf-8").write(s2)
    print("  ✓ requirements.txt 已补 Phase B 依赖")
else:
    print("  - requirements.txt 已含 onnxruntime")
