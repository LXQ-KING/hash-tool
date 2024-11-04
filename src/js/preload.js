const { contextBridge, ipcRenderer, shell } = require('electron')
const crypto = require('crypto')

contextBridge.exposeInMainWorld('api', {  
  require: module => require(module),
  getWindowInfo: () => ipcRenderer.invoke('get-window-info'),
  operateWindow: (action, data) => ipcRenderer.send('operate-window', action, data),
  onWindowBlur: callback => ipcRenderer.on('window-blur', callback),
  openExternalLink: url => shell.openExternal(url),
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  onToggleLoading: callback => ipcRenderer.on('toggle-loading', (event, show) => callback(show)),
  calculateHash: (algorithm, fileBuffer) => crypto.createHash(algorithm).update(fileBuffer).digest('hex')
});