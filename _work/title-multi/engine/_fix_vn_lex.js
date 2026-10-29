// 修正 VN 主题词中「…的规定」式冗余与英文重复介词
'use strict';
const fs = require('fs');
const path = require('path');
const dir = __dirname;

const fixes = {
  'lexicon-vn-add1.json': {
    'Ban hành Văn bản quy phạm pháp luật': { zh: '法律规范性文件颁布' },
    'Ban hành văn bản quy phạm pháp luật của Hội đồng nhân dân, Uỷ ban nhân dân': { zh: '人民议会与人民委员会法律规范性文件颁布' },
    'Ký kết, gia nhập và thực hiện điều ước quốc tế': { zh: '国际条约签署、加入与履行' }
  },
  'lexicon-vn-add2.json': {
    'Về việc Quy định chế độ phục vụ của sỹ quan Quân đội nhân dân Việt Nam': {
      zh: '越南人民军军官服役制度',
      en: "service regime for officers of the Vietnam People's Army"
    },
    'Về việc Tổ chức chính quyền địa phương': {
      zh: '地方政权组织',
      en: 'organisation of local government'
    },
    'Về việc quy định quyền tự do hội họp': {
      zh: '集会自由规制',
      en: 'regulation of freedom of assembly'
    },
    'Về việc đảm bảo quyền tự do thân thể và quyền bất khả xâm phạm đối với nhà ở, đồ vật, thư tín của nhân dân': {
      zh: '人身自由及人民住宅、财物、通信不可侵犯权的保障',
      en: "guarantee of the right to personal freedom and the inviolability of people's homes, property and correspondence"
    }
  }
};

let n = 0;
for (const [file, patch] of Object.entries(fixes)) {
  const p = path.join(dir, file);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const [k, v] of Object.entries(patch)) {
    if (!j.subjects[k]) { console.log('未找到键', file, k); continue; }
    Object.assign(j.subjects[k], v);
    n++;
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 1) + '\n', 'utf8');
}
console.log('修改', n, '条');
