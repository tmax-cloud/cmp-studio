export const maximizeWindowSize = () =>
  window.electron.ipcRenderer.send('studio:maximizeWindowSize');
