#!/usr/bin/env node

/**
 * 自动合并导出的照片数据到构建后的HTML文件
 * 使用方法：
 * 1. 先运行 npm run build
 * 2. 导出HTML文件（通过网页的Export按钮）
 * 3. 将导出的文件放到 dist 文件夹
 * 4. 运行此脚本：node scripts/merge-export.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const indexExportPath = path.join(distDir, 'index-export.html');
const finalIndexPath = path.join(distDir, 'index.html');

console.log('🔍 检查文件...\n');

// 查找导出的HTML文件（支持多种文件名格式）
const findExportFile = () => {
  const possibleNames = [
    'love-in-mexico-export.html',
    'love-in-mexico-export (1).html',
    'love-in-mexico-export (2).html',
  ];
  
  // 先尝试精确匹配
  for (const name of possibleNames) {
    const filePath = path.join(distDir, name);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  
  // 如果精确匹配失败，查找所有匹配的文件
  const files = fs.readdirSync(distDir);
  const exportFile = files.find(file => 
    file.startsWith('love-in-mexico-export') && file.endsWith('.html')
  );
  
  if (exportFile) {
    return path.join(distDir, exportFile);
  }
  
  return null;
};

const exportHtmlPath = findExportFile();

// 检查导出的HTML文件
if (!exportHtmlPath || !fs.existsSync(exportHtmlPath)) {
  console.log('❌ 错误：找不到导出的HTML文件！');
  console.log('   请确保 love-in-mexico-export.html 文件在 dist 文件夹中。');
  console.log('   支持的文件名格式：');
  console.log('   - love-in-mexico-export.html');
  console.log('   - love-in-mexico-export (1).html');
  console.log('   - love-in-mexico-export (2).html\n');
  process.exit(1);
}

console.log(`✅ 找到导出文件: ${path.basename(exportHtmlPath)}\n`);

// 检查构建后的index-export.html
if (!fs.existsSync(indexExportPath)) {
  console.log('❌ 错误：找不到构建后的文件！');
  console.log('   请先运行：npm run build\n');
  process.exit(1);
}

console.log('✅ 找到所有必需的文件\n');

// 读取导出的HTML文件，提取照片数据
console.log('📖 读取导出的照片数据...');
const exportedHtml = fs.readFileSync(exportHtmlPath, 'utf-8');

// 提取照片数据
const photoDataMatch = exportedHtml.match(/window\.EMBEDDED_PHOTOS\s*=\s*(\[[\s\S]*?\]);/);
if (!photoDataMatch || !photoDataMatch[1]) {
  console.log('❌ 错误：无法从导出的HTML文件中提取照片数据！');
  console.log('   请确保导出的HTML文件格式正确。\n');
  process.exit(1);
}

const photoData = photoDataMatch[1].trim();
console.log(`✅ 成功提取照片数据（${photoData.length} 字符）\n`);

// 提取音乐数据
console.log('📖 读取导出的音乐数据...');
let musicData = 'null';

// 先检查是否为 null
if (exportedHtml.match(/window\.EMBEDDED_MUSIC\s*=\s*null\s*;/)) {
  musicData = 'null';
  console.log('⚠️  音乐数据为 null\n');
} else {
  // 提取 <script> 标签内的内容
  const scriptStart = exportedHtml.indexOf('<script>');
  const scriptEnd = exportedHtml.indexOf('</script>', scriptStart);
  
  if (scriptStart >= 0 && scriptEnd >= 0) {
    const scriptContent = exportedHtml.substring(scriptStart + '<script>'.length, scriptEnd);
    
    // 在script内容中查找 EMBEDDED_MUSIC 行
    const lines = scriptContent.split('\n');
    const musicLine = lines.find(line => line.includes('EMBEDDED_MUSIC'));
    
    if (musicLine) {
      // 使用单行匹配，因为音乐数据通常在一行中
      // 匹配从 = 之后到行尾 ; 之前的所有内容（贪婪匹配）
      const match = musicLine.match(/EMBEDDED_MUSIC\s*=\s*(.+);\s*$/);
      if (match && match[1]) {
        const musicStr = match[1].trim();
        if (musicStr === 'null') {
          musicData = 'null';
          console.log('⚠️  音乐数据为 null\n');
        } else {
          // 尝试解析JSON以验证格式
          try {
            const parsed = JSON.parse(musicStr);
            musicData = musicStr;
            console.log(`✅ 成功提取音乐数据（${musicData.length} 字符）\n`);
          } catch (e) {
            console.log('⚠️  音乐数据格式错误:', e.message);
            console.log('   前100字符:', musicStr.substring(0, 100));
            console.log('   将使用 null\n');
            musicData = 'null';
          }
        }
      } else {
        console.log('⚠️  无法从音乐行中提取数据\n');
      }
    } else {
      console.log('⚠️  未找到音乐数据行\n');
    }
  } else {
    console.log('⚠️  未找到 <script> 标签\n');
  }
}

// 读取构建后的index-export.html
console.log('📖 读取构建后的HTML模板...');
const indexExportHtml = fs.readFileSync(indexExportPath, 'utf-8');

// 替换照片数据
console.log('🔧 合并照片数据...');
let finalHtml = indexExportHtml.replace(
  /window\.EMBEDDED_PHOTOS\s*=\s*\[\];/,
  `window.EMBEDDED_PHOTOS = ${photoData};`
);

// 替换音乐数据
console.log('🔧 合并音乐数据...');
finalHtml = finalHtml.replace(
  /window\.EMBEDDED_MUSIC\s*=\s*null;/,
  `window.EMBEDDED_MUSIC = ${musicData};`
);

// 检查是否成功替换
if (!finalHtml.includes(photoData)) {
  console.log('❌ 错误：照片数据合并失败！');
  process.exit(1);
}

// 确保使用导出版本的脚本引用（export.js而不是main.js）
const exportScriptMatch = indexExportHtml.match(/<script[^>]*src="([^"]*export[^"]*)"[^>]*>/);
if (exportScriptMatch) {
  const exportScript = exportScriptMatch[0];
  // 替换main.js为export.js（如果存在）
  finalHtml = finalHtml.replace(
    /<script[^>]*src="[^"]*main[^"]*"[^>]*>/,
    exportScript
  );
  
  // 确保所有资源引用都来自index-export.html
  const exportLinks = indexExportHtml.matchAll(/<link[^>]*href="([^"]+)"[^>]*>/g);
  for (const linkMatch of exportLinks) {
    const linkTag = linkMatch[0];
    const href = linkMatch[1];
    // 替换对应的link标签
    finalHtml = finalHtml.replace(
      new RegExp(`<link[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'g'),
      linkTag
    );
  }
}

// 备份原来的index.html
if (fs.existsSync(finalIndexPath)) {
  const backupPath = path.join(distDir, 'index.html.backup');
  fs.copyFileSync(finalIndexPath, backupPath);
  console.log('💾 已备份原来的 index.html\n');
}

// 写入最终的index.html
fs.writeFileSync(finalIndexPath, finalHtml);
console.log('✅ 照片和音乐数据已成功合并到 dist/index.html\n');

console.log('🎉 完成！现在可以：');
console.log('   • 直接打开 dist/index.html');
console.log('   • 或运行 npm run preview\n');

