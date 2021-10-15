import { OpenDialogArgs } from '@main/dialog/common/dialog';

export const openDialog = (args: OpenDialogArgs) =>
  window.electron.ipcRenderer.send('studio:openDialog', args);
