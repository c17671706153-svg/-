const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  // 创建应用图标
  let appIcon = null;
  const iconPath = path.join(__dirname, 'build/icon.svg');
  
  if (fs.existsSync(iconPath)) {
    try {
      // 尝试从SVG创建图标
      appIcon = nativeImage.createFromPath(iconPath);
    } catch (error) {
      console.log('无法加载SVG图标，使用默认图标');
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

  // 加载本地构建的文件
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  
  // 窗口准备就绪时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  // 开发模式下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
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