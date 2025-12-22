# 导出功能使用说明

## 快速开始

### 方法一：使用导出的HTML文件（推荐）

1. **上传照片**
   - 在网页中上传至少5张照片
   - 确保照片都显示正常

2. **导出HTML文件**
   - 点击右下角的 "💾 Export" 按钮
   - 会下载一个名为 `love-in-mexico-export.html` 的文件

3. **构建项目**
   ```bash
   npm run build
   ```

4. **使用导出的HTML**
   - 构建完成后，进入 `dist` 文件夹
   - 将下载的 `love-in-mexico-export.html` 文件复制到 `dist` 文件夹
   - 重命名为 `index.html`（建议先备份原来的 `index.html`）
   - 现在可以直接打开 `dist/index.html` 或使用 `npm run preview` 预览

### 方法二：直接预览导出版本

1. 构建项目：
   ```bash
   npm run build
   ```

2. 将导出的HTML文件放到dist文件夹并重命名为 `index.html`

3. 预览：
   ```bash
   npm run preview
   ```

## 导出版本特点

- ✅ 照片数据已嵌入，无需重新上传
- ✅ 无 "Photo" 按钮（无法修改照片）
- ✅ 所有其他功能与正常版本相同
- ✅ 可以分享给他人，他们可以直接使用，无需上传照片

## 注意事项

- 导出的HTML文件包含所有照片数据，文件可能较大
- 导出版本的照片是固定的，无法修改
- 如果需要修改照片，请使用正常版本重新导出





