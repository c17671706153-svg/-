# 部署指南 - 将圣诞树网页分享给朋友

## 🚀 方案1：Netlify Drop（最简单，推荐）

### 步骤：
1. 访问 https://app.netlify.com/drop
2. 直接将整个 `dist` 文件夹拖拽到网页上
3. 等待上传完成（可能需要几分钟，因为文件较大）
4. Netlify 会自动生成一个链接，例如：`https://random-name-123.netlify.app`
5. 复制这个链接，直接分享给朋友！

### 优点：
- ✅ 完全免费
- ✅ 无需注册账号（但建议注册以管理网站）
- ✅ 拖拽即用，最简单
- ✅ 自动HTTPS
- ✅ 全球CDN加速

---

## 🌐 方案2：Vercel（也很简单）

### 步骤：
1. 访问 https://vercel.com
2. 注册/登录账号
3. 点击 "Add New Project"
4. 选择 "Import Git Repository" 或直接上传文件夹
5. 或者使用命令行：
   ```bash
   npm i -g vercel
   cd dist
   vercel
   ```
6. 按照提示完成部署
7. 获得分享链接

### 优点：
- ✅ 免费
- ✅ 快速部署
- ✅ 自动HTTPS
- ✅ 全球CDN

---

## 📦 方案3：GitHub Pages（需要GitHub账号）

### 步骤：
1. 在GitHub上创建一个新仓库
2. 将 `dist` 文件夹的内容上传到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择 `main` 分支和 `/` 根目录
5. 获得链接：`https://your-username.github.io/repo-name`

### 优点：
- ✅ 完全免费
- ✅ 版本控制
- ✅ 可以自定义域名

---

## 🎯 方案4：直接使用文件分享服务

如果只是临时分享，可以使用：
- **WeTransfer**: https://wetransfer.com
- **Google Drive**: 上传后分享链接
- **Dropbox**: 上传后生成分享链接

但这种方式需要朋友下载文件后打开，不如在线链接方便。

---

## ⚠️ 重要提示

1. **文件大小**：导出的HTML文件可能很大（包含照片和音乐），上传可能需要一些时间
2. **确保文件完整**：部署前确保 `dist` 文件夹包含：
   - `index.html`（已合并照片和音乐）
   - `assets/` 文件夹（包含所有JS和CSS文件）
3. **测试链接**：部署后先自己测试一下，确保所有功能正常

---

## 📝 推荐流程

1. ✅ 确保已经运行 `npm run build-and-merge`
2. ✅ 检查 `dist/index.html` 是否包含照片和音乐数据
3. ✅ 使用 **Netlify Drop** 拖拽 `dist` 文件夹
4. ✅ 获得链接后测试功能
5. ✅ 分享链接给朋友！

---

## 🔗 快速命令

如果使用命令行部署到 Netlify：
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
cd dist
netlify deploy --prod
```



