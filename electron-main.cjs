const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  // 创建应用图标
  let appIcon = null;
  const iconPath = path.join(__dirname, 'build/icon.png');
  
  if (fs.existsSync(iconPath)) {
    try {
      // 尝试从PNG创建图标
      appIcon = nativeImage.createFromPath(iconPath);
      console.log('成功加载应用图标');
    } catch (error) {
      console.log('无法加载图标，使用默认图标:', error.message);
    }
  } else {
    console.log('图标文件不存在:', iconPath);
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
  const indexPath = path.join(__dirname, 'dist/index.html');
  console.log('加载文件:', indexPath);
  
  mainWindow.loadFile(indexPath);
  
  // 窗口准备就绪时显示
  mainWindow.once('ready-to-show', () => {
    console.log('窗口准备就绪，显示窗口');
    mainWindow.show();
  });
  
  // 开发模式下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  return mainWindow;
}

app.whenReady().then(() => {
  console.log('Electron应用准备就绪');
  const mainWindow = createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('所有窗口已关闭');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 设置应用名称
app.setName('Christmas Tree Interactive Album');