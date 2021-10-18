import * as WorkspaceTypes from '@main/workspaces/common/workspace';

export const openExistFolder = (
  args: WorkspaceTypes.WorkspaceOpenProjectArgs
) => window.electron.ipcRenderer.invoke('studio:openExistFolder', args);

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
