#!/bin/bash
# PH 长散文标题机翻：自动循环
# 每轮：译 1500 → 打包 → 专用质检 → 剔除坏条 → 重新打包 → 入库
# 全部完成后需另跑 sync-titles-to-catalog / rebuild-index / verify-data
set -u
cd "$(dirname "$0")/../.." || exit 1

for i in $(seq 1 15); do
  echo "===== 第 $i 轮 $(date '+%H:%M:%S') ====="
  node _work/title-multi/_ph_mt.js --limit 1500 --conc 20 --batch 10 2>&1 | tail -2

  node _work/title-multi/_ph_mt_pack.js --out _ph_mt_auto 2>&1 | tail -1
  N=$(node -e "try{console.log(Object.keys(require('./_work/title-multi/_ph_mt_auto.json').items).length)}catch(e){console.log(0)}")
  echo "待入库 $N"
  if [ "$N" -eq 0 ]; then echo "全部完成"; break; fi

  node _work/title-multi/_ph_mt_qchk.js _work/title-multi/_ph_mt_auto.json 2>&1 | head -2
  if [ -f _work/title-multi/_ph_mt_auto.mtbad.json ]; then
    node _work/title-multi/_ph_mt_purge.js _work/title-multi/_ph_mt_auto.mtbad.json 2>&1 | tail -1
    node _work/title-multi/_ph_mt_pack.js --out _ph_mt_auto 2>&1 | tail -1
  fi
  node _work/title-multi/apply-multi.js _work/title-multi/_ph_mt_auto.json 2>&1 | head -2
done
echo "===== 循环结束 $(date '+%H:%M:%S') ====="
