#!/bin/bash

# Christmas Tree Interactive Album - Electron打包脚本

echo "🎄 开始打包圣诞互动相册桌面应用..."

# 1. 构建React应用
echo "📦 构建React应用..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ React构建失败"
    exit 1
fi

# 2. 创建图标
echo "🎨 创建应用图标..."
node create-icon.js

if [ $? -ne 0 ]; then
    echo "❌ 图标创建失败"
    exit 1
fi

# 3. 创建应用目录
echo "📁 创建应用包..."
APP_NAME="Christmas Tree Interactive Album.app"
APP_DIR="dist-electron/$APP_NAME"
CONTENTS_DIR="$APP_DIR/Contents"
RESOURCES_DIR="$CONTENTS_DIR/Resources"
MACOS_DIR="$CONTENTS_DIR/MacOS"

# 清理旧文件
rm -rf "dist-electron"

# 创建目录结构
mkdir -p "$RESOURCES_DIR"
mkdir -p "$MACOS_DIR"
mkdir -p "$CONTENTS_DIR/Frameworks"

# 4. 复制应用文件
echo "📋 复制应用文件..."
cp -r dist/* "$RESOURCES_DIR/"
cp electron-main.cjs "$MACOS_DIR/Christmas Tree Interactive Album"
cp build/icon.png "$RESOURCES_DIR/"

# 5. 创建Info.plist
cat > "$CONTENTS_DIR/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>Christmas Tree Interactive Album</string>
    <key>CFBundleDisplayName</key>
    <string>Christmas Tree Interactive Album</string>
    <key>CFBundleIdentifier</key>
    <string>com.christmas-tree.app</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleExecutable</key>
    <string>Christmas Tree Interactive Album</string>
    <key>CFBundleIconFile</key>
    <string>icon</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.11.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>LSUIElement</key>
    <false/>
</dict>
</plist>
EOF

# 6. 创建启动脚本
cat > "$MACOS_DIR/Christmas Tree Interactive Album" << 'EOF'
#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
exec electron "$(dirname "$DIR")/Resources/electron-main.cjs"
EOF

chmod +x "$MACOS_DIR/Christmas Tree Interactive Album"

# 7. 复制Electron框架
echo "📦 复制Electron框架..."
# 注意：这里需要手动复制Electron.app的内容，或者使用electron-packager

# 8. 创建简化版本（推荐）
echo "🎯 创建简化应用包..."
cat > "$RESOURCES_DIR/electron-main.cjs" << 'EOF'
const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  let appIcon = null;
  const iconPath = path.join(__dirname, 'icon.png');
  
  if (fs.existsSync(iconPath)) {
    try {
      appIcon = nativeImage.createFromPath(iconPath);
    } catch (error) {
      console.log('无法加载图标，使用默认图标');
    }
  }

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Christmas Tree Interactive Album',
    icon: appIcon,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a',
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.setName('Christmas Tree Interactive Album');
EOF

echo "✅ 应用打包完成！"
echo "📍 应用位置: $APP_DIR"
echo "🚀 运行方式:"
echo "   1. 直接运行: npx electron dist-electron/Resources/electron-main.cjs"
echo "   2. 或者使用electron-packager创建完整的.app包"
echo ""
echo "💡 提示：要创建完整的macOS应用包，建议安装electron-packager:"
echo "   npm install -g electron-packager"
echo "   electron-packager . 'Christmas Tree Interactive Album' --platform=darwin --arch=arm64 --out=dist-apps"