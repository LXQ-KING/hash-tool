const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

try {
  require('electron-reloader')(module)
} catch (err) {

}

app.commandLine.appendSwitch('no-sandbox')

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
    icon:  iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile(path.join(__dirname, 'html', 'app.html'))
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  Menu.setApplicationMenu(null)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})