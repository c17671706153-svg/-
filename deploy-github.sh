#!/bin/bash

# 🎄 圣诞互动相册 - GitHub Pages 一键部署脚本

echo "🎄 圣诞互动相册 GitHub Pages 部署工具"
echo "======================================"
echo ""

# 检查git是否初始化
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
fi

# 检查是否有远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 请先在GitHub创建仓库，然后添加远程仓库："
    echo "   1. 访问 https://github.com/new"
    echo "   2. 创建仓库：christmas-tree-interactive-album"
    echo "   3. 复制仓库地址"
    echo ""
    read -p "输入GitHub仓库地址（如：https://github.com/yourname/repo.git）: " repo_url
    git remote add origin $repo_url
fi

# 安装gh-pages
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 安装gh-pages依赖..."
    npm install --save-dev gh-pages
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建目录不存在"
    exit 1
fi

echo "✅ 构建成功！"
echo "📊 构建统计："
echo "   HTML文件：$(find dist -name "*.html" | wc -l)"
echo "   JS文件：$(find dist -name "*.js" | wc -l)"
echo "   CSS文件：$(find dist -name "*.css" | wc -l)"
echo "   图片文件：$(find dist -name "*.png" -o -name "*.jpg" -o -name "*.svg" | wc -l)"
echo ""

# 询问是否使用GitHub Actions
read -p "是否使用GitHub Actions自动部署？(y/n): " use_actions

if [ "$use_actions" = "y" ] || [ "$use_actions" = "Y" ]; then
    echo "🤖 配置GitHub Actions自动部署..."
    
    # 创建工作流目录
    mkdir -p .github/workflows
    
    # 检查是否已有工作流文件
    if [ -f ".github/workflows/deploy-github-pages.yml" ]; then
        echo "✅ GitHub Actions工作流已存在"
    else
        echo "❌ GitHub Actions工作流文件不存在，请确保文件已创建"
    fi
    
    echo "📋 下一步："
    echo "   1. 推送代码到GitHub: git push -u origin main"
    echo "   2. 在GitHub仓库设置中启用Pages"
    echo "   3. 选择GitHub Actions作为部署源"
    
else
    echo "📤 使用gh-pages分支部署..."
    
    # 部署到gh-pages
    echo "🚀 部署到GitHub Pages..."
    npx gh-pages -d dist
    
    if [ $? -eq 0 ]; then
        echo "✅ 部署成功！"
        echo "🌐 应用地址："
        
        # 获取GitHub用户名和仓库名
        remote_url=$(git remote get-url origin)
        if [[ $remote_url =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
            username="${BASH_REMATCH[1]}"
            repo="${BASH_REMATCH[2]}"
            echo "   https://$username.github.io/$repo/"
        else
            echo "   请查看GitHub仓库的Pages设置获取链接"
        fi
        
        echo ""
        echo "⏰ 部署可能需要几分钟时间生效"
        echo "🔄 如果页面没有立即显示，请稍等2-3分钟后刷新"
        
    else
        echo "❌ 部署失败，请检查错误信息"
        exit 1
    fi
fi

echo ""
echo "🎉 GitHub Pages部署完成！"
echo "📧 部署通知将发送到您的邮箱"
echo ""
echo "💡 提示："
echo "   - 确保GitHub Pages在仓库设置中已启用"
echo "   - 检查部署状态在仓库的Actions或Pages标签页"
echo "   - 首次部署可能需要几分钟时间"
echo ""
echo "🎄 圣诞快乐！您的互动相册即将上线！✨"