const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

// 热加载模块
try {
  require('electron-reloader')(module)
} catch (err) {

}

// 禁用沙箱模式
app.commandLine.appendSwitch('no-sandbox')

// 创建窗口
const createWindow = () => {
  if (process.platform === 'win32') {
    iconPath = path.join(__dirname, 'assets', 'images', 'favicon.ico')
  } else if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, 'assets', 'images', 'favicon.icns')
  } else {
    iconPath = path.join(__dirname, 'assets', 'images', 'favicon.png')
  }
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'js', 'preload.js'),
      nodeIntegration: true,
      // contextIsolation: false
    }
  })

  win.loadFile(path.join(__dirname, 'html', 'app.html'))
  // win.webContents.openDevTools()

  win.on('blur', () => {
    win.webContents.send('window-blur')
  })
  win.on('maximize', () => {
    win.webContents.send('window-blur')
  })
  win.on('unmaximize', () => {
    win.webContents.send('window-blur')
    const flag = win.webContents.isDevToolsOpened()
    win.webContents.closeDevTools()
    flag && win.webContents.openDevTools()
  })

  ipcMain.handle('get-window-info', () => {
    return {
      isMaximized: win.isMaximized(),
      isAlwaysOnTop: win.isAlwaysOnTop(),
      isDevToolsOpened: win.webContents.isDevToolsOpened()
    }
  })

  ipcMain.on('operate-window', (e, action, data) => {
    switch (action) {
      case 'min':
        win.minimize()
        break
      case 'max':
        win.maximize()
        break
      case 'close':
        win.close()
        break
      case 'restore':
        // win.restore()
        win.unmaximize()
        break
      case 'always-on-top':
        win.setAlwaysOnTop(data)
        break
      case 'reload':
        win.webContents.reload()
        break
      case 'toggle-devtools':
        // win.webContents.toggleDevTools()
        data ? win.webContents.openDevTools() : win.webContents.closeDevTools()
        break
      default:
        break
    }
  });
}

// 加载窗口
app.whenReady().then(() => {
  createWindow()
  Menu.setApplicationMenu(null)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 关闭窗口
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})