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
  selectDownloadFile: (defaultFileName) => ipcRenderer.invoke('select-download-file', defaultFileName),
  onDownloadFile: callback => ipcRenderer.on('get-download-content', (event, filePath, downFile) => callback(filePath, downFile)),
  sendDownloadContent: (filePath, data) => ipcRenderer.send('download-content',  filePath, data),
  onDownloadResponse: callback => ipcRenderer.on('download-file-result', (event, ifDownloaded) => callback(ifDownloaded)),
  onToggleLoading: callback => ipcRenderer.on('toggle-loading', (event, show) => callback(show)),
  calculateHash: (algorithm, fileBuffer) => crypto.createHash(algorithm).update(fileBuffer).digest('hex')
});