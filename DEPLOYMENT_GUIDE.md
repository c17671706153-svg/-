# 🎄 圣诞互动相册 - 在线部署指南

## 📱 项目介绍

这是一个基于React + Three.js的3D圣诞互动相册应用，具有：
- 🎄 3D圣诞树场景
- 📸 照片展示功能
- 🎵 背景音乐播放
- ✨ 粒子效果和动画
- 🎁 交互式元素

## 🚀 快速部署选项

### 选项1：一键Vercel部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/christmas-tree-interactive-album)

### 选项2：手动部署到Vercel

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   npm run deploy
   ```

### 选项3：部署到其他平台

#### Netlify部署
1. 构建项目：
   ```bash
   npm run build
   ```

2. 拖拽`dist`文件夹到[Netlify](https://app.netlify.com/drop)

#### GitHub Pages部署
1. 安装gh-pages：
   ```bash
   npm install --save-dev gh-pages
   ```

2. 添加脚本到package.json：
   ```json
   "scripts": {
     "deploy:gh": "npm run build && gh-pages -d dist"
   }
   ```

3. 运行部署：
   ```bash
   npm run deploy:gh
   ```

## ⚙️ 环境配置

### 系统要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 🔧 配置说明

### Vite配置
项目使用Vite作为构建工具，配置在`vite.config.ts`中：
- 支持React
- 代码分割优化
- 生产环境压缩
- 多页面支持

### 路由配置
- 主应用：`index.html`
- 导出版本：`index-export.html`

## 📁 项目结构

```
├── public/                 # 静态资源
├── src/
│   ├── components/        # React组件
│   ├── contexts/        # React上下文
│   ├── utils/           # 工具函数
│   ├── types.ts         # TypeScript类型定义
│   ├── constants.ts     # 常量定义
│   └── App.tsx          # 主应用组件
├── dist/                # 构建输出目录
├── vercel.json          # Vercel部署配置
└── vite.config.ts       # Vite配置文件
```

## 🎯 功能特性

### 核心功能
- **3D圣诞树**：使用Three.js渲染的3D场景
- **照片展示**：支持多张照片的交互式展示
- **音乐播放**：背景音乐控制
- **粒子效果**：雪花和星光效果
- **手势控制**：支持触摸和鼠标交互

### 性能优化
- 代码分割
- 懒加载
- 资源压缩
- 缓存优化

## 🔍 故障排除

### 常见问题

1. **构建失败**
   - 检查Node.js版本是否满足要求
   - 清除node_modules并重新安装依赖
   - 检查网络连接是否正常

2. **部署后页面空白**
   - 确认构建是否成功
   - 检查浏览器控制台错误信息
   - 验证路由配置是否正确

3. **资源加载失败**
   - 检查资源路径配置
   - 确认文件是否被正确复制到构建目录
   - 检查网络请求是否被阻止

### 获取帮助
- 查看构建日志
- 检查浏览器开发者工具
- 验证部署配置

## 🔗 相关链接

- [Vite官方文档](https://vitejs.dev/)
- [React官方文档](https://reactjs.org/)
- [Three.js官方文档](https://threejs.org/)
- [Vercel文档](https://vercel.com/docs)

## 📄 许可证

MIT License - 详见项目根目录的LICENSE文件