export type WorkspaceIdentifier = {
  id: string;
  workspaceRealPath: string;
  terraformExePath: string;
  isPinned: boolean;
};

export type RecentWorkspace = {
  folderUri: string;
  labelTitle?: string;
  labelUri?: string;
  lastOpenedTime: number;
};

export interface WorkspaceManagementServiceInterface {
  createNewWorkspaceMeta(workspaceRealPath: string): Promise<string>;
  checkWorkspacePathUnique(workspaceRealPath: string): boolean;
  removeOldWorkspaceMeta(workspaceRealPath: string): void;
  removeGhostWorkspaceMeta(workspaceRealPath: string): void;
  getWorkspaceIdByFolderUri(folderUri: string): string | null;
  checkRealWorkspaceExists(workspaceRealPath: string): boolean;
  getWorkspaceConfig(uid: string): any;
}
export interface WorkspacesHistoryServiceInterface {
  addWorkspaceToStorage(folderUri: string): void;
  getRecentlyOpenedWorkspaces(): RecentWorkspace[];
}

export interface WorkspaceMainServiceInterface {
  workspaceManagementService: WorkspaceManagementServiceInterface;
  workspacesHistoryService: WorkspacesHistoryServiceInterface;
}
