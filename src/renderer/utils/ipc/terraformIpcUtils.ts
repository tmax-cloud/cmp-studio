export const getTerraformGraph = (workspaceUid: string) =>
  window.electron.ipcRenderer.invoke('studio:getTerraformGraph', {
    workspaceUid,
  });

export const doTerraformInit = (workspaceUid: string) =>
  window.electron.ipcRenderer.invoke('studio:doTerraformInit', {
    workspaceUid,
  });

export const getTerraformVersion = (workspaceUid: string) =>
  window.electron.ipcRenderer.invoke('studio:getTerraformVersion', {
    workspaceUid,
  });
