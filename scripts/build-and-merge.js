#!/usr/bin/env node

/**
 * 一键构建和合并脚本
 * 自动完成：构建项目 → 检测导出的HTML → 合并照片数据 → 完成
 * 
 * 使用方法：
 * npm run build-and-merge
 * 
 * 或者：
 * node scripts/build-and-merge.js [导出的HTML文件路径]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const indexExportPath = path.join(distDir, 'index-export.html');
const finalIndexPath = path.join(distDir, 'index.html');

console.log('🚀 一键构建和合并脚本\n');
console.log('='.repeat(50) + '\n');

// 步骤1: 查找导出的HTML文件
console.log('📂 步骤1: 查找导出的HTML文件...\n');

let exportHtmlPath = null;

// 如果提供了命令行参数
if (process.argv[2]) {
  exportHtmlPath = path.resolve(process.argv[2]);
  if (!fs.existsSync(exportHtmlPath)) {
    console.log(`❌ 错误：找不到指定的文件：${exportHtmlPath}\n`);
    process.exit(1);
  }
  console.log(`✅ 找到指定的导出文件：${exportHtmlPath}\n`);
} else {
  // 自动查找导出的HTML文件
  const possiblePaths = [
    path.join(distDir, 'love-in-mexico-export.html'),
    path.join(__dirname, '../love-in-mexico-export.html'),
    path.join(process.cwd(), 'love-in-mexico-export.html'),
    path.join(os.homedir(), 'Downloads', 'love-in-mexico-export.html'),
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      exportHtmlPath = possiblePath;
      console.log(`✅ 找到导出的HTML文件：${exportHtmlPath}\n`);
      break;
    }
  }

  if (!exportHtmlPath) {
    console.log('⚠️  未找到导出的HTML文件！');
    console.log('   请确保你已经：');
    console.log('   1. 在网页中上传照片并点击"Export"按钮');
    console.log('   2. 将下载的 love-in-mexico-export.html 文件放到以下位置之一：');
    console.log('      - dist 文件夹');
    console.log('      - 项目根目录');
    console.log('      - 下载文件夹');
    console.log('\n   或者直接指定文件路径：');
    console.log('   npm run build-and-merge [文件路径]\n');
    console.log('   继续构建项目（不合并照片数据）...\n');
  }
}

// 步骤2: 构建项目
console.log('🔨 步骤2: 构建项目...\n');
try {
  console.log('   运行: npm run build\n');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('\n✅ 构建完成！\n');
} catch (error) {
  console.log('\n❌ 构建失败！');
  console.log('   请确保已经安装了所有依赖：npm install\n');
  process.exit(1);
}

// 步骤3: 合并照片数据（如果找到了导出文件）
if (exportHtmlPath) {
  console.log('🔧 步骤3: 合并照片数据...\n');
  
  try {
    // 读取导出的HTML文件
    console.log('   读取导出的照片数据...');
    const exportedHtml = fs.readFileSync(exportHtmlPath, 'utf-8');
    
    // 提取照片数据
    const photoDataMatch = exportedHtml.match(/window\.EMBEDDED_PHOTOS\s*=\s*(\[[\s\S]*?\]);/);
    if (!photoDataMatch || !photoDataMatch[1]) {
      console.log('   ❌ 错误：无法从导出的HTML文件中提取照片数据！');
      console.log('   请确保导出的HTML文件格式正确。\n');
      process.exit(1);
    }
    
    const photoData = photoDataMatch[1].trim();
    const photoCount = (photoData.match(/{"id"/g) || []).length;
    console.log(`   ✅ 成功提取照片数据（${photoCount} 张照片）\n`);
    
    // 提取音乐数据
    console.log('   读取导出的音乐数据...');
    // 使用更精确的匹配，确保捕获完整的JSON对象（包括多行）
    const musicDataMatch = exportedHtml.match(/window\.EMBEDDED_MUSIC\s*=\s*(\{[\s\S]*?\}|null);/);
    let musicData = 'null';
    if (musicDataMatch && musicDataMatch[1] && musicDataMatch[1] !== 'null') {
      musicData = musicDataMatch[1].trim();
      // 验证JSON格式
      try {
        JSON.parse(musicData);
        console.log(`   ✅ 成功提取音乐数据\n`);
      } catch (e) {
        console.log('   ⚠️  音乐数据格式错误，将使用 null\n');
        musicData = 'null';
      }
    } else {
      console.log('   ⚠️  未找到音乐数据，将使用 null\n');
    }
    
    // 检查构建后的文件
    if (!fs.existsSync(indexExportPath)) {
      console.log('   ❌ 错误：构建后未找到 index-export.html！');
      console.log('   请检查构建是否成功。\n');
      process.exit(1);
    }
    
    // 读取构建后的HTML
    console.log('   读取构建后的HTML模板...');
    const indexExportHtml = fs.readFileSync(indexExportPath, 'utf-8');
    
    // 替换照片数据
    console.log('   合并照片数据...');
    let finalHtml = indexExportHtml.replace(
      /window\.EMBEDDED_PHOTOS\s*=\s*\[\];/,
      `window.EMBEDDED_PHOTOS = ${photoData};`
    );
    
    // 替换音乐数据
    console.log('   合并音乐数据...');
    finalHtml = finalHtml.replace(
      /window\.EMBEDDED_MUSIC\s*=\s*null;/,
      `window.EMBEDDED_MUSIC = ${musicData};`
    );
    
    // 检查是否成功替换
    if (!finalHtml.includes(photoData)) {
      console.log('   ❌ 错误：照片数据合并失败！\n');
      process.exit(1);
    }
    
    // index-export.html已经包含了正确的export.js脚本引用，所以不需要额外替换
    
    // 备份原来的index.html
    if (fs.existsSync(finalIndexPath)) {
      const backupPath = path.join(distDir, 'index.html.backup');
      fs.copyFileSync(finalIndexPath, backupPath);
      console.log('   💾 已备份原来的 index.html\n');
    }
    
    // 写入最终的index.html
    fs.writeFileSync(finalIndexPath, finalHtml);
    console.log('   ✅ 照片和音乐数据已成功合并到 dist/index.html\n');
    
  } catch (error) {
    console.log(`   ❌ 合并失败：${error.message}\n`);
    process.exit(1);
  }
} else {
  console.log('⚠️  步骤3: 跳过合并（未找到导出的HTML文件）\n');
  console.log('   提示：如果你有导出的HTML文件，可以：');
  console.log('   1. 将文件放到 dist 文件夹');
  console.log('   2. 运行：npm run merge-export\n');
}

// 完成
console.log('='.repeat(50) + '\n');
console.log('🎉 完成！\n');
console.log('📁 输出文件：dist/index.html\n');
console.log('🚀 现在可以：');
console.log('   • 直接打开 dist/index.html');
console.log('   • 或运行 npm run preview\n');

