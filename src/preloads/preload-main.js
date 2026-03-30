const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openChat: (channel) => ipcRenderer.invoke('open-chat', channel),
  getLastChannel: () => ipcRenderer.invoke('get-last-channel'),
  twitchLogin: () => ipcRenderer.invoke('twitch-login'),
  isLoggedIn: () => ipcRenderer.invoke('is-logged-in'),
  importFFZSettings: () => ipcRenderer.invoke('import-ffz-settings'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  quit: () => ipcRenderer.invoke('quit-app'),
});
