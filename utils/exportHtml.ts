import { PhotoData } from '../contexts/PhotoContext';
import { MusicData } from '../contexts/MusicContext';

interface MusicExportData {
  default: MusicData | null;
  special: MusicData | null;
}

export const exportToHtml = async (
  photos: PhotoData[], 
  defaultMusic: MusicData | null,
  specialMusic: MusicData | null
) => {
  if (photos.length < 5) {
    alert('请至少上传 5 张照片后再导出。');
    return;
  }

  // Create a standalone HTML file with embedded photos and music
  const photosJson = JSON.stringify(photos);
  const musicExportData: MusicExportData = {
    default: defaultMusic,
    special: specialMusic,
  };
  const musicJson = JSON.stringify(musicExportData);
  
  // Generate HTML that matches the built index-export.html structure
  // User needs to manually copy the script/link tags from dist/index-export.html after building
  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>圣诞快乐</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;1,400&family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #000502;
        overflow: hidden;
        font-family: 'Playfair Display', serif;
      }
      
      canvas {
        touch-action: none;
      }

      ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }
    </style>
    <script>
      // Embedded photos and music data - loaded before React app starts
      window.EMBEDDED_PHOTOS = ${photosJson};
      window.EMBEDDED_MUSIC = ${musicJson};
    </script>
    <!-- 
      ⚠️ 重要：构建后需要手动添加资源引用
      
      使用步骤：
      1. 运行 npm run build
      2. 打开 dist/index-export.html，复制其中的 <script> 和 <link> 标签
         （通常在 </script> 标签之后，</head> 标签之前）
      3. 将复制的标签粘贴到下面（替换这个注释）
      4. 保存文件并重命名为 index.html
      5. 替换 dist/index.html
    -->
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

  // Create a blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shengdan-kuaile-export.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert('✅ HTML 文件已下载！\\n\\n🚀 一键完成：\\n\\n1️⃣ 将下载的 shengdan-kuaile-export.html\\n   放到 dist 文件夹（或项目根目录）\\n\\n2️⃣ 运行命令：\\n   npm run build-and-merge\\n\\n3️⃣ 完成！打开 dist/index.html 即可\\n\\n💡 或者手动操作：\\n   npm run build\\n   npm run merge-export\\n\\n✨ 导出版本：照片已嵌入，无“照片”按钮');
};

