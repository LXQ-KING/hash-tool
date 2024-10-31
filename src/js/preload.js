const { contextBridge, ipcRenderer, shell } = require('electron');  

contextBridge.exposeInMainWorld('api', {  
  require: module => require(module),
  getWindowInfo: () => ipcRenderer.invoke('get-window-info'),
  operateWindow: (action, data) => ipcRenderer.send('operate-window', action, data),
  onWindowBlur: callback => ipcRenderer.on('window-blur', callback),
  openExternalLink: url => shell.openExternal(url)
});