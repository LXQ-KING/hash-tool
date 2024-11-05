const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const { get } = require('http')

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

  ipcMain.handle('select-file', async e => {
    const { canceld, filePaths } = await dialog.showOpenDialog(win, {
      title: '选择文件',
      properties: ['openFile', 'multiSelections'],
      modal: true
    })
    if (canceld || !filePaths.length) {
      return { canceld: true, files: [] }
    } else {
      e.sender.send('toggle-loading', true)
      const files = await Promise.all(filePaths.map(filePath => {
        const content = fs.readFileSync(filePath, 'utf8')
        const fileName = path.basename(filePath)
        return { filePath, fileName, content }
      }))
      return { canceld: false, files }
    }
  })
  
  ipcMain.handle('select-folder', async e => {
    const { canceld, filePaths } = await dialog.showOpenDialog(win, {
      title: '选择文件夹',
      properties: ['openDirectory'],
      modal: true
    })
    if (canceld ||!filePaths.length) {
      return { canceld: true, files: [] }
    } else {
      e.sender.send('toggle-loading', true)
      const filePath = filePaths[0]
      // let files = []
      const files = readFolder(filePath)
      return { canceld: false, files }
    }
  })

  ipcMain.handle('select-download-file', async (e, downFile) => {
    defaultFileName = path.basename(downFile)
    const { canceld, filePath } = await dialog.showSaveDialog(win, {
      title: '下载文件',
      properties: ['openFile'],
      defaultPath: defaultFileName ? defaultFileName.replace(path.extname(defaultFileName), '') + '-哈希值' : defaultFileName.replace(path.extname(defaultFileName), '') + '哈希值',
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      modal: true
    })
    if (canceld || !filePath) {
      return { canceld: true, files: {} }
    } else {
      e.sender.send('toggle-loading', true)
      const content = defaultFileName ? e.sender.send('get-download-content', filePath, downFile) : e.sender.send('get-download-content', filePath, 'all')
      const file = {
        filePath: filePath,
        fileName: path.basename(filePath)
      }
      return { canceld: false, file }
    }
  })

  ipcMain.on('download-content', (e, filePath, data) => {
    fs.writeFileSync(filePath, data)
    // e.sender.send('toggle-loading', false)
    e.sender.send('download-file-result', true)
  })
}

function readFolder(folderPath) {
  let files = []
  async function readDirRecursive(folderPath) {
    const items = fs.readdirSync(folderPath)
    await Promise.all(items.forEach(item => {
      const fullPath = path.join(folderPath, item)
      const stats = fs.statSync(fullPath)
      if (stats.isDirectory()) {
        readDirRecursive(fullPath)
      } else {
        files.push({ filePath: fullPath, fileName: item, content: fs.readFileSync(fullPath, 'utf8') })
      }
    }))
  }
  readDirRecursive(folderPath)
  return files
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