import { ipcMain } from 'electron';
import { makeDir } from '../../base/common/fileUtils';
import {
  WorkspacesHistoryServiceInterface,
  WorkspaceManagementServiceInterface,
  WorkspaceMainServiceInterface,
} from '../common/workspace';
import { WorkspaceManagementService } from './workspaceManagementService';
import { IPCResponse } from '../../base/common/ipc';
import { WorkspacesHistoryService } from './workspacesHistoryService';
import { StorageMainServiceInterface } from '../../storage/common/storage';

// TODO : history, management에 워크스페이스 지워주는 기능들도 구현해야 됨.
export class WorkspaceMainService implements WorkspaceMainServiceInterface {
  public workspaceManagementService: WorkspaceManagementServiceInterface;

  public workspacesHistoryService: WorkspacesHistoryServiceInterface;

  constructor(
    private readonly storageMainService: StorageMainServiceInterface
  ) {
    this.workspaceManagementService = new WorkspaceManagementService();
    this.workspacesHistoryService = new WorkspacesHistoryService(
      this.storageMainService
    );
    this.registerListeners();
  }

  init() {}

  async makeNewFolderAndWorkspaceMeta(folderUri: string) {
    try {
      makeDir(folderUri);
      if (
        !this.workspaceManagementService.checkWorkspacePathUnique(folderUri)
      ) {
        // MEMO : 새로운 폴더를 만들땐 기존 workspacemeta중 겹치는 경로에 대한 메타들을 다 지워준다.
        this.workspaceManagementService.removeOldWorkspaceMeta(folderUri);
      }
      const uid = await this.workspaceManagementService.createNewWorkspaceMeta(
        folderUri
      );
      return uid;
      // TODO : uid로 히스토리에 넣어주기?
    } catch (err) {
      throw new Error('' + err);
    }
  }

  // TODO : 히스토리에서 눌렀을 때 folderUri exists체크 먼저 해주고 통과하면 이걸로 id받아오기
  // TODO : fodlerURi 없으면 meta도 삭제해주는 부분도 구현하기
  async getWorkspaceMetaOfExistFolder(folderUri: string) {
    const uid =
      this.workspaceManagementService.getWorkspaceIdByFolderUri(folderUri);

    if (!!uid) {
      //MEMO : workspacemeta가 있으면 그거 반환,
      return uid;
    }
    //MEMO : workspacemeta가 없으면 만들어주고 반환
    const newUid = await this.workspaceManagementService.createNewWorkspaceMeta(
      folderUri
    );
    return newUid;
  }

  private registerListeners() {
    ipcMain.handle(
      'studio:createNewFolderAndWorkspace',
      async (event, arg: { folderUri: string }): Promise<IPCResponse> => {
        const { folderUri } = arg;
        if (!!folderUri) {
          const uid = await this.makeNewFolderAndWorkspaceMeta(folderUri);
          this.workspacesHistoryService.addWorkspaceToStorage(folderUri);
          return {
            status: 'Success',
            data: { uid },
          };
        }
        return { status: 'Error', data: { message: 'Invalid folder uri.' } };
      }
    );

    ipcMain.handle(
      'studio:openExistFolder',
      async (event, arg: { folderUri: string }): Promise<IPCResponse> => {
        const { folderUri } = arg;
        if (!!folderUri) {
          if (
            this.workspaceManagementService.checkRealWorkspaceExists(folderUri)
          ) {
            const uid = await this.getWorkspaceMetaOfExistFolder(folderUri);
            this.workspacesHistoryService.addWorkspaceToStorage(folderUri);
            // TODO : 지금은 uid만 반환해주는데 열리는 부분은 어떻게 처리하지? win size도 바꿔줘야 함
            return { status: 'Success', data: { uid } };
          }

          this.workspaceManagementService.removeGhostWorkspaceMeta(folderUri);
          return {
            status: 'Error',
            data: { message: `There is no such folder : ${folderUri}` },
          };
        }
        return { status: 'Error', data: { message: 'Invalid folder uri.' } };
      }
    );

    ipcMain.handle(
      'studio:getRecentlyOpenedWorkspaces',
      async (event, arg): Promise<IPCResponse> => {
        try {
          const entries =
            this.workspacesHistoryService.getRecentlyOpenedWorkspaces();
          return { status: 'Success', data: { entries } };
        } catch (err) {
          return {
            status: 'Error',
            data: { message: 'Failed to get workspace history' },
          };
        }
      }
    );
  }
}
