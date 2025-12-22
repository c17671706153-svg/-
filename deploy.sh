#!/bin/bash

# 🎄 圣诞互动相册 - 部署脚本集合

echo "🎄 圣诞互动相册部署工具"
echo "========================"
echo ""
echo "请选择部署方式："
echo "1. Vercel部署（推荐）"
echo "2. Netlify部署"
echo "3. GitHub Pages部署"
echo "4. 本地测试"
echo "5. 构建检查"
echo ""
read -p "输入选项 (1-5): " choice

case $choice in
    1)
        echo "🚀 开始Vercel部署..."
        echo "步骤："
        echo "1. 确保已安装Vercel CLI: npm i -g vercel"
        echo "2. 确保已登录: vercel login"
        echo "3. 运行: npm run deploy"
        npm run deploy
        ;;
    2)
        echo "📦 开始Netlify部署..."
        echo "步骤："
        echo "1. 构建项目..."
        npm run build
        echo "2. 构建完成，请访问 netlify.com/drop"
        echo "3. 拖拽 dist 文件夹到网页上"
        echo "4. 等待部署完成"
        echo ""
        echo "✅ 构建文件已准备就绪，位置: dist/"
        ls -la dist/
        ;;
    3)
        echo "🐙 开始GitHub Pages部署..."
        echo "步骤："
        echo "1. 安装gh-pages: npm install --save-dev gh-pages"
        echo "2. 构建项目..."
        npm run build
        echo "3. 部署到GitHub Pages..."
        npx gh-pages -d dist
        echo "4. 访问: https://[your-username].github.io/[repo-name]"
        ;;
    4)
        echo "🧪 本地测试..."
        echo "启动本地服务器测试构建结果..."
        npm run preview
        ;;
    5)
        echo "🔍 构建检查..."
        echo "1. 清理旧的构建文件..."
        rm -rf dist
        echo "2. 开始构建..."
        npm run build
        echo "3. 构建统计："
        echo "   文件大小："
        du -h dist/
        echo "   文件列表："
        ls -la dist/
        echo "4. 构建检查完成 ✅"
        ;;
    *)
        echo "❌ 无效选项，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署操作完成！"
echo "📋 部署总结："
echo "   应用名称：圣诞互动相册"
echo "   版本：1.0.0"
echo "   构建时间：$(date)"
echo ""
echo "🌟 感谢使用圣诞互动相册部署工具！"