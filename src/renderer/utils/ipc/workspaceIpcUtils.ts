import * as WorkspaceTypes from '@main/workspaces/common/workspace';

export const openExistFolder = (
  args: WorkspaceTypes.WorkspaceOpenProjectArgs
) => window.electron.ipcRenderer.invoke('studio:openExistFolder', args);

export const getFolderUriByWorkspaceId = (
  args: WorkspaceTypes.WorkspaceGetFolderUriArgs
) =>
  window.electron.ipcRenderer.invoke('studio:getFolderUriByWorkspaceId', args);

export const getRecentlyOpenedWorkspaces = () =>
  window.electron.ipcRenderer.invoke('studio:getRecentlyOpenedWorkspaces');

export const getDefaultNewProjectName = () =>
  window.electron.ipcRenderer.invoke('studio:getDefaultNewProjectName');

export const getDefaultNewProjectsFolderPath = () =>
  window.electron.ipcRenderer.invoke('studio:getDefaultNewProjectsFolderPath');

export const createNewFolderAndWorkspace = (
  args: WorkspaceTypes.WorkspaceCreateNewProjectArgs
) =>
  window.electron.ipcRenderer.invoke(
    'studio:createNewFolderAndWorkspace',
    args
  );

export const getProjectJson = (
  args: WorkspaceTypes.WorkspaceGetProjectJsonArgs
) => window.electron.ipcRenderer.invoke('studio:getProjectJson', args);

export const exportProject = (args: {
  objects: WorkspaceTypes.TerraformFileJsonMeta[];
}) => window.electron.ipcRenderer.invoke('studio:exportProject', args);

export const setWorkspaceConfigItem = (
  args: WorkspaceTypes.WorkspaceSetConfigItemArgs
) => window.electron.ipcRenderer.invoke('studio:setWorkspaceConfigItem', args);

export const removeWorkspaceHistoryItem = (
  args: WorkspaceTypes.RemoveWorkspaceHistoryItemArgs
) =>
  window.electron.ipcRenderer.invoke('studio:removeWorkspaceHistoryItem', args);
