import * as WindowTypes from '@main/windows/common/windows';

export const maximizeWindowSize = () =>
  window.electron.ipcRenderer.send('studio:maximizeWindowSize');

export const setWindowSize = (args: WindowTypes.WindowSetSizeArgs) =>
  window.electron.ipcRenderer.send('studio:setWindowSize', args);

export const closeWindow = () =>
  window.electron.ipcRenderer.send('studio:closeWindow');
