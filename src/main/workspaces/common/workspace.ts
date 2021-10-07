export interface IWorkspaceIdentifier {
  id: string;
  workspaceRealPath: string;
  isPinned: boolean;
}

export interface IRecentWorkspace {
  folderUri: string;
  labelTitle?: string;
  labelUri?: string;
}

export interface IWorkspaceManagementService {
  createNewWorkspaceMeta(workspaceRealPath: string): Promise<string>;
  checkWorkspacePathUnique(workspaceRealPath: string): boolean;
  removeOldWorkspaceMeta(workspaceRealPath: string): void;
  getWorkspaceIdByFolderUri(folderUri: string): string | null;
  checkRealWorkspaceExists(workspaceRealPath: string): boolean;
}
export interface IWorkspacesHistoryService {
  addWorkspaceToStorage(folderUri: string): void;
  getRecentlyOpenedWorkspaces(): IRecentWorkspace[];
}
