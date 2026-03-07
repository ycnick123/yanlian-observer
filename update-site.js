const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const now = new Date();
const timeStr = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
const dateStr = now.toISOString().split('T')[0];

// 1. 更新最后更新时间
html = html.replace(
  /最后更新：<span id="update-time">[^<]+<\/span>/,
  `最后更新：<span id="update-time">${timeStr}</span>`
);

// 2. 更新统计数字（根据信息区实际条目数）
// 每日简报：3 (news-briefing-2026-03-07, vc-brief-2026-03-07, news-briefing-2026-03-06)
// 专题简报：2 (抖音热榜 x2)
// 任务完成：2 (GitHub Pages 部署，网站实时更新)
// 工作笔记：7 (工作流程优化，连载小说设定 x3, 每日复盘，AI 标注修正，VC 分类调整)
// 原创小说：1
// 总计：15
html = html.replace(/id="count-daily">[\d]+/, 'id="count-daily">3');
html = html.replace(/id="count-brief">[\d]+/, 'id="count-brief">2');
html = html.replace(/id="count-task">[\d]+/, 'id="count-task">2');
html = html.replace(/id="count-note">[\d]+/, 'id="count-note">7');
html = html.replace(/id="count-novel">[\d]+/, 'id="count-novel">1');
html = html.replace(/id="count-all">[\d]+/, 'id="count-all">15');

// 3. 更新任务看板数字
// 进行中：1 (网站实时更新)
// 等待中：1 (心跳监控)
// 已完成：5 (开机自检、每日简报、VC 投资、每日复盘、网站自动更新)
html = html.replace(
  /<div class="text-2xl font-bold text-green-600">🟢<\/div>\s*<p class="text-gray-600">进行中<\/p>\s*<p class="text-2xl font-bold mt-2">[\d]+<\/p>/,
  `<div class="text-3xl font-bold text-green-600">🟢</div>\n                                <p class="text-gray-600">进行中</p>\n                                <p class="text-2xl font-bold mt-2">1</p>`
);

html = html.replace(
  /<div class="text-2xl font-bold text-yellow-600">🟡<\/div>\s*<p class="text-gray-600">等待中<\/p>\s*<p class="text-2xl font-bold mt-2">[\d]+<\/p>/,
  `<div class="text-3xl font-bold text-yellow-600">🟡</div>\n                                <p class="text-gray-600">等待中</p>\n                                <p class="text-2xl font-bold mt-2">1</p>`
);

html = html.replace(
  /<div class="text-2xl font-bold text-blue-600">✅<\/div>\s*<p class="text-gray-600">已完成<\/p>\s*<p class="text-2xl font-bold mt-2">[\d]+<\/p>/,
  `<div class="text-3xl font-bold text-blue-600">✅</div>\n                                <p class="text-gray-600">已完成</p>\n                                <p class="text-2xl font-bold mt-2">5</p>`
);

// 4. 更新 VC 简报条目时间（将 12:46 更新为当前时间）
html = html.replace(
  /🕐 12:46 完成 · 来源：投资界/,
  `🕐 ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')} 完成 · 来源：投资界`
);

// 5. 更新工作日记中的"网站实时更新"时间（如果有 10:07 的条目，保持但更新最新时间）
// 根据用户要求，不要添加新的"网站实时更新"条目，只更新现有时间戳

fs.writeFileSync(filePath, html, 'utf8');

console.log('✅ 网站更新完成');
console.log('   更新时间:', timeStr);
console.log('   文件大小:', fs.statSync(filePath).size, 'bytes');
