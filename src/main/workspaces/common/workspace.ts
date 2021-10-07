export type WorkspaceIdentifier = {
  id: string;
  workspaceRealPath: string;
  isPinned: boolean;
};

export type RecentWorkspace = {
  folderUri: string;
  labelTitle?: string;
  labelUri?: string;
};

export interface WorkspaceManagementServiceInterface {
  createNewWorkspaceMeta(workspaceRealPath: string): Promise<string>;
  checkWorkspacePathUnique(workspaceRealPath: string): boolean;
  removeOldWorkspaceMeta(workspaceRealPath: string): void;
  removeGhostWorkspaceMeta(workspaceRealPath: string): void;
  getWorkspaceIdByFolderUri(folderUri: string): string | null;
  checkRealWorkspaceExists(workspaceRealPath: string): boolean;
}
export interface WorkspacesHistoryServiceInterface {
  addWorkspaceToStorage(folderUri: string): void;
  getRecentlyOpenedWorkspaces(): RecentWorkspace[];
}
