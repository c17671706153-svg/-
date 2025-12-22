# 📦 导出功能使用指南

## 简单三步使用导出的HTML

### ✅ 你已经完成：导出了HTML文件
- 文件名为：`love-in-mexico-export.html`
- 这个文件包含了你的所有照片数据

### 📋 接下来的步骤：

#### 步骤 1: 构建项目
```bash
npm run build
```
这会生成 `dist` 文件夹和所有必要的文件。

#### 步骤 2: 合并照片数据到构建文件
有两种方法：

**方法A：手动操作（推荐）**
1. 打开 `dist/index-export.html` 文件
2. 找到这一行：`window.EMBEDDED_PHOTOS = [];`
3. 打开你下载的 `love-in-mexico-export.html` 文件
4. 找到这一行：`window.EMBEDDED_PHOTOS = [你的照片数据];`
5. 复制照片数据（整个数组，从 `[` 到 `]`）
6. 粘贴到 `dist/index-export.html` 中，替换 `[]`
7. 保存 `dist/index-export.html`
8. 重命名为 `index.html`，替换原来的 `dist/index.html`

**方法B：使用脚本（如果配置了）**
```bash
node scripts/prepare-export.js
```

#### 步骤 3: 使用导出版本
```bash
npm run preview
```
或者直接双击 `dist/index.html` 打开

## ✨ 导出版本特点

- ✅ **照片已嵌入**：所有照片数据都在HTML中，无需重新上传
- ✅ **无Photo按钮**：无法修改照片（照片已固定）
- ✅ **功能完整**：树上照片、CHAOS模式照片墙、点击放大等功能都正常
- ✅ **可分享**：可以将整个 `dist` 文件夹分享给他人

## 💡 提示

- 导出的HTML文件包含所有照片的Base64数据，文件可能较大（几MB到几十MB）
- 如果需要修改照片，请使用正常版本重新上传并导出
- 每次构建后，资源文件名可能会变化（因为有hash），所以需要重新合并照片数据





