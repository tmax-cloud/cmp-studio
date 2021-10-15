export const setAppConfigItem = (args: { key: string; data: any }) =>
  window.electron.ipcRenderer.send('studio:setAppConfigItem', args);

export const setAppConfigItems = (args: {
  items: { key: string; data: any }[];
}) => window.electron.ipcRenderer.send('studio:setAppConfigItems', args);

export const getAppConfigItem = (args: { key: string }) =>
  window.electron.ipcRenderer.invoke('studio:getAppConfigItem', args);
