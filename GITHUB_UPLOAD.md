# 📤 上传到 GitHub 指南

## 步骤 1: 在 GitHub 创建仓库

1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - Repository name: `christmas-tree-photo-album` (或你喜欢的名字)
   - Description: "Interactive 3D Christmas Tree Photo Album"
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize with README"
4. 点击 "Create repository"

## 步骤 2: 连接并推送代码

在终端运行以下命令（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）：

```bash
# 添加远程仓库
git remote add origin https://github.com/mushroomcat-super/Christmas-tree-interactive-album

# 重命名分支为 main（如果还没有）
git branch -M main

# 推送代码
git push -u origin main
```

## 步骤 3: 验证

访问你的 GitHub 仓库页面，应该能看到所有文件。

## 📝 注意事项

- `dist` 文件夹已被 `.gitignore` 忽略（这是正常的，因为可以通过 `npm run build` 重新生成）
- `node_modules` 也被忽略（通过 `npm install` 安装）
- 源代码和配置文件都已上传

## 🌐 可选：使用 GitHub Pages 托管

如果你想在 GitHub Pages 上托管网站，可以：

1. 在仓库设置中启用 GitHub Pages
2. 选择 `main` 分支和 `/dist` 目录
3. 或者使用 GitHub Actions 自动构建和部署

需要我帮你设置 GitHub Pages 吗？

