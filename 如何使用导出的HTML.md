# 📦 如何使用导出的HTML文件

## 简单说明

你导出的 `love-in-mexico-export.html` 文件包含了你的所有照片数据，但它需要与构建后的文件一起使用。

## 📋 使用步骤

### 1️⃣ 先构建项目
```bash
npm run build
```

### 2️⃣ 合并照片数据

**方法：手动操作（很简单）**

1. 打开 `dist/index-export.html` 文件（用文本编辑器）
2. 找到这一行：
   ```javascript
   window.EMBEDDED_PHOTOS = [];
   ```

3. 打开你下载的 `love-in-mexico-export.html` 文件
4. 找到这一行（应该很长，包含你的照片数据）：
   ```javascript
   window.EMBEDDED_PHOTOS = [{"id":"...","dataUrl":"data:image/..."}, ...];
   ```

5. 复制整个数组（从 `[` 开始到 `]` 结束，包括所有照片数据）

6. 回到 `dist/index-export.html`，将 `[]` 替换为刚才复制的照片数据

7. 保存文件

8. 将 `dist/index-export.html` 重命名为 `index.html`，替换原来的 `dist/index.html`

### 3️⃣ 使用导出版本

现在有两种方式使用：

**方式A：直接打开**
- 双击 `dist/index.html` 在浏览器中打开

**方式B：使用预览服务器**
```bash
npm run preview
```

## ✨ 导出版本特点

- ✅ 照片已嵌入，无需重新上传
- ✅ 无 Photo 按钮（无法修改照片）
- ✅ 功能与正常版本相同（树上照片、CHAOS模式、点击放大都正常）

## 💡 提示

- 每次构建后，只需要重复步骤2（合并照片数据）即可
- 导出的HTML文件可以保存，以后需要时再使用
- 可以将整个 `dist` 文件夹分享给他人





