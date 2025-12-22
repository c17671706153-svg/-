import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建512x512的canvas
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// 背景渐变
const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
gradient.addColorStop(0, '#1a5f1a');
gradient.addColorStop(1, '#0d3d0d');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 512, 512);

// 外圈
ctx.strokeStyle = '#2d5a2d';
ctx.lineWidth = 4;
ctx.beginPath();
ctx.arc(256, 256, 250, 0, Math.PI * 2);
ctx.stroke();

// 圣诞树底层
ctx.fillStyle = '#228B22';
ctx.beginPath();
ctx.moveTo(256, 120);
ctx.lineTo(180, 220);
ctx.lineTo(332, 220);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#1a5f1a';
ctx.stroke();

// 圣诞树中层
ctx.fillStyle = '#32CD32';
ctx.beginPath();
ctx.moveTo(256, 180);
ctx.lineTo(160, 280);
ctx.lineTo(352, 280);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#228B22';
ctx.stroke();

// 圣诞树顶层
ctx.fillStyle = '#228B22';
ctx.beginPath();
ctx.moveTo(256, 240);
ctx.lineTo(140, 340);
ctx.lineTo(372, 340);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#1a5f1a';
ctx.stroke();

// 树干
ctx.fillStyle = '#8B4513';
ctx.fillRect(236, 340, 40, 60);
ctx.strokeStyle = '#654321';
ctx.strokeRect(236, 340, 40, 60);

// 星星
ctx.fillStyle = '#FFD700';
ctx.beginPath();
ctx.moveTo(256, 80);
ctx.lineTo(264, 104);
ctx.lineTo(288, 104);
ctx.lineTo(270, 120);
ctx.lineTo(278, 144);
ctx.lineTo(256, 132);
ctx.lineTo(234, 144);
ctx.lineTo(242, 120);
ctx.lineTo(224, 104);
ctx.lineTo(248, 104);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#DAA520';
ctx.stroke();

// 装饰球
const ornaments = [
  { x: 220, y: 200, r: 12, color: '#FF0000', stroke: '#CC0000' },
  { x: 292, y: 220, r: 10, color: '#FF6347', stroke: '#CC4125' },
  { x: 240, y: 260, r: 14, color: '#FFD700', stroke: '#DAA520' },
  { x: 272, y: 280, r: 11, color: '#FF69B4', stroke: '#CC217B' },
  { x: 200, y: 300, r: 13, color: '#00CED1', stroke: '#0099A8' },
  { x: 312, y: 320, r: 9, color: '#FF4500', stroke: '#CC3700' }
];

ornaments.forEach(ornament => {
  ctx.fillStyle = ornament.color;
  ctx.beginPath();
  ctx.arc(ornament.x, ornament.y, ornament.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ornament.stroke;
  ctx.stroke();
});

// 雪花装饰
ctx.fillStyle = '#FFFFFF';
ctx.globalAlpha = 0.7;
ctx.beginPath();
ctx.arc(100, 100, 6, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(412, 150, 5, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(80, 400, 7, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(432, 380, 6, 0, Math.PI * 2);
ctx.fill();

// 保存为PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'build/icon.png'), buffer);

console.log('图标已创建: build/icon.png');