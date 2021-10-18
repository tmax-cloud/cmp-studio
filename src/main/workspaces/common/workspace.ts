import { IPCResponse } from '../../base/common/ipc';

export type WorkspaceCreateNewProjectArgs = {
  folderUri: string;
  workspaceName: string;
};

export type WorkspaceOpenProjectArgs = {
  folderUri: string;
};

export type WorkspaceGetProjectJsonArgs = {
  folderUri: string;
};

export enum WorkspaceStatusType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  ERROR_FILE_EXISTS = 'ERROR_FILE_EXISTS',
  ERROR_NO_PROJECT = 'ERROR_NO_PROJECT',
}

export type WorkspaceStatus =
  | WorkspaceStatusType.SUCCESS
  | WorkspaceStatusType.ERROR
  | WorkspaceStatusType.ERROR_NO_PROJECT
  | WorkspaceStatusType.ERROR_FILE_EXISTS;

export type RecentWorkspaceData = RecentWorkspace & {
  isPinned: boolean;
  workspaceUid: string;
};

export type RecentWorkspacesDataArray = {
  entries: RecentWorkspaceData[];
};

export type WorkspaceSuccessUidData = {
  uid: string;
};

export type MakeDefaultNameSuccessData = string;

export type TerraformFileJsonMeta = {
  filePath: string;
  fileJson: any;
};

export type WorkspaceProjectJsonSuccessData = TerraformFileJsonMeta[];

export type WorkspaceErrorData = {
  message: string;
};

export type WorkspaceData =
  | WorkspaceSuccessUidData
  | MakeDefaultNameSuccessData
  | RecentWorkspacesDataArray
  | WorkspaceProjectJsonSuccessData
  | WorkspaceErrorData;

export type WorkspaceResponse = IPCResponse<WorkspaceStatus, WorkspaceData>;

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
  generateDefaultNewWorkspaceName(): string;
}
export interface WorkspacesHistoryServiceInterface {
  addWorkspaceToStorage(folderUri: string): void;
  getRecentlyOpenedWorkspaces(): RecentWorkspace[];
}

export interface WorkspaceConvertServiceInterface {
  convertAllHclToJson(folderUri: string): WorkspaceProjectJsonSuccessData;
}

export interface WorkspaceMainServiceInterface {
  workspaceManagementService: WorkspaceManagementServiceInterface;
  workspacesHistoryService: WorkspacesHistoryServiceInterface;
}
