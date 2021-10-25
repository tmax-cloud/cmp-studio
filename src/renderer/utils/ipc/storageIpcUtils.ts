import * as StorageTypes from '@main/storage/common/storage';

export const setStorageItem = (args: StorageTypes.StorageSetItemArgs) =>
  window.electron.ipcRenderer.send('studio:setStorageItem', args);

export const setStorageItems = (args: StorageTypes.StorageSetItemsArgs) =>
  window.electron.ipcRenderer.send('studio:setStorageItems', args);

export const getStorageItem = (args: StorageTypes.StorageGetItemArgs) =>
  window.electron.ipcRenderer.invoke('studio:getStorageItem', args);
