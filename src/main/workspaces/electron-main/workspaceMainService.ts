import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { makeDir } from '../../base/common/fileUtils';
import { getDocumentsPath } from '../../base/common/pathUtils';
import * as WorkspaceTypes from '../common/workspace';
import { WorkspaceManagementService } from './workspaceManagementService';
import { WorkspacesHistoryService } from './workspacesHistoryService';
import { StorageMainServiceInterface } from '../../storage/common/storage';
import { WorkspaceConvertService } from './workspaceConvertService';

// TODO : history, management에 워크스페이스 지워주는 기능들도 구현해야 됨.
export class WorkspaceMainService
  implements WorkspaceTypes.WorkspaceMainServiceInterface
{
  public workspaceManagementService: WorkspaceTypes.WorkspaceManagementServiceInterface;

  public workspacesHistoryService: WorkspaceTypes.WorkspacesHistoryServiceInterface;

  public workspaceConvertService: WorkspaceTypes.WorkspaceConvertServiceInterface;

  constructor(
    private readonly storageMainService: StorageMainServiceInterface
  ) {
    this.workspaceManagementService = new WorkspaceManagementService();
    this.workspacesHistoryService = new WorkspacesHistoryService(
      this.storageMainService
    );
    this.workspaceConvertService = new WorkspaceConvertService();
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

  async getFolderUriByWorkspaceId(workspaceId: string) {
    const folderUri =
      this.workspaceManagementService.getFolderUriByWorkspaceId(workspaceId);
    return folderUri;
  }

  async getFolderNameByWorkspaceId(workspaceId: string) {
    const folderName =
      this.workspaceManagementService.getFolderNameByWorkspaceId(workspaceId);
    return folderName;
  }

  private registerListeners() {
    ipcMain.handle(
      'studio:createNewFolderAndWorkspace',
      async (
        event,
        arg: WorkspaceTypes.WorkspaceCreateNewProjectArgs
      ): Promise<WorkspaceTypes.WorkspaceResponse> => {
        const { folderUri, workspaceName } = arg;
        try {
          if (!!folderUri) {
            const uri = path.join(folderUri, workspaceName);
            if (fs.existsSync(uri)) {
              return {
                status: WorkspaceTypes.WorkspaceStatusType.ERROR_FILE_EXISTS,
                data: {
                  message: `${workspaceName} is already exists.`,
                },
              };
            }
            const uid = await this.makeNewFolderAndWorkspaceMeta(uri);
            this.workspacesHistoryService.addWorkspaceToStorage(uri);
            return {
              status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
              data: { uid },
            };
          }
        } catch (e: any) {
          return {
            status: WorkspaceTypes.WorkspaceStatusType.ERROR,
            data: { message: e },
          };
        }
        return {
          status: WorkspaceTypes.WorkspaceStatusType.ERROR,
          data: { message: 'Invalid folder uri.' },
        };
      }
    );

    ipcMain.handle(
      'studio:getFolderUriByWorkspaceId',
      async (
        event,
        arg: WorkspaceTypes.WorkspaceGetFolderUriArgs
      ): Promise<any> => {
        const { workspaceId } = arg;
        const folderUri = await this.getFolderUriByWorkspaceId(workspaceId);
        return folderUri;
      }
    );

    ipcMain.handle(
      'studio:getFolderNameByWorkspaceId',
      async (
        event,
        arg: WorkspaceTypes.WorkspaceGetFolderUriArgs
      ): Promise<any> => {
        const { workspaceId } = arg;
        const folderUri = await this.getFolderNameByWorkspaceId(workspaceId);
        return folderUri;
      }
    );

    ipcMain.handle(
      'studio:openExistFolder',
      async (
        event,
        arg: WorkspaceTypes.WorkspaceOpenProjectArgs
      ): Promise<WorkspaceTypes.WorkspaceResponse> => {
        const { folderUri } = arg;
        if (!!folderUri) {
          if (
            this.workspaceManagementService.checkRealWorkspaceExists(folderUri)
          ) {
            const uid = await this.getWorkspaceMetaOfExistFolder(folderUri);
            this.workspacesHistoryService.addWorkspaceToStorage(folderUri);
            this.workspaceManagementService.copyRealToTempFolder(uid);
            return {
              status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
              data: { uid },
            };
          }
          this.workspaceManagementService.removeGhostWorkspaceMeta(folderUri);
          return {
            status: WorkspaceTypes.WorkspaceStatusType.ERROR_NO_PROJECT,
            data: { message: `There is no such folder : ${folderUri}` },
          };
        }
        return {
          status: WorkspaceTypes.WorkspaceStatusType.ERROR,
          data: { message: 'Invalid folder uri.' },
        };
      }
    );

    ipcMain.handle(
      'studio:setWorkspaceConfigItem',
      (event, arg: WorkspaceTypes.WorkspaceSetConfigItemArgs) => {
        const { workspaceUid, key, data } = arg;
        if (workspaceUid && key) {
          this.workspaceManagementService.setWorkspaceConfigItem(
            workspaceUid,
            key,
            data
          );
          return {
            status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
            data: '',
          };
        }
        return {
          status: WorkspaceTypes.WorkspaceStatusType.ERROR,
          data: `[Error] Failed to set workspace config item : ${workspaceUid}`,
        };
      }
    );

    ipcMain.handle(
      'studio:getRecentlyOpenedWorkspaces',
      async (event, arg): Promise<WorkspaceTypes.WorkspaceResponse> => {
        try {
          const entries =
            this.workspacesHistoryService.getRecentlyOpenedWorkspaces();
          const prettyEntries: WorkspaceTypes.RecentWorkspaceData[] = [];
          for (const entry of entries) {
            const uid =
              this.workspaceManagementService.getWorkspaceIdByFolderUri(
                entry.folderUri
              );
            if (uid) {
              const workspaceConfig =
                this.workspaceManagementService.getWorkspaceConfig(uid);
              prettyEntries.push({
                ...entry,
                isPinned: workspaceConfig.isPinned || false,
                workspaceUid: uid,
              });
            }
          }
          return {
            status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
            data: { entries: prettyEntries },
          };
        } catch (err) {
          return {
            status: WorkspaceTypes.WorkspaceStatusType.ERROR,
            data: { message: 'Failed to get workspace history' },
          };
        }
      }
    );

    ipcMain.handle(
      'studio:getDefaultNewProjectsFolderPath',
      (event, arg): WorkspaceTypes.WorkspaceResponse => {
        return {
          status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
          data: getDocumentsPath(),
        };
      }
    );

    ipcMain.handle(
      'studio:getDefaultNewProjectName',
      (event, arg): WorkspaceTypes.WorkspaceResponse => {
        return {
          status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
          data: this.workspaceManagementService.generateDefaultNewWorkspaceName(),
        };
      }
    );

    ipcMain.handle(
      'studio:getProjectJson',
      (
        event,
        arg: WorkspaceTypes.WorkspaceGetProjectJsonArgs
      ): WorkspaceTypes.WorkspaceResponse => {
        const { folderUri } = arg;
        console.log('Im start point');
        try {
          console.log('while converter');
          const result =
            this.workspaceConvertService.convertAllHclToJson(folderUri);
          console.log('after converter');
          return {
            status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
            data: result,
          };
        } catch (e: any) {
          console.log('converter or case block');
          if (e === WorkspaceTypes.WorkspaceStatusType.ERROR_NO_PROJECT) {
            return {
              status: WorkspaceTypes.WorkspaceStatusType.ERROR_NO_PROJECT,
              data: `[Error] Error occurred while converting terrafrom data into json : Cannot find the project.`,
            };
          }
          return {
            status: WorkspaceTypes.WorkspaceStatusType.ERROR,
            data: `[Error] Error occurred while converting terrafrom data into json : ${e}`,
          };
        }
      }
    );
    ipcMain.handle(
      'studio:exportProject',
      (
        event,
        arg: WorkspaceTypes.WorkspaceExportProjectArgs
      ): WorkspaceTypes.WorkspaceResponse => {
        const { objects, typeMap, workspaceUid, isAllSave, deleteTypeInfo } =
          arg;
        try {
          this.workspaceConvertService.convertAllJsonToHcl(
            objects,
            typeMap,
            workspaceUid,
            isAllSave,
            deleteTypeInfo
          );
          return {
            status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
            data: 'Project saved successfully.',
          };
        } catch (e: any) {
          return {
            status: WorkspaceTypes.WorkspaceStatusType.ERROR,
            data: `[Error] Error occured while saving the project : ${e}`,
          };
        }
      }
    );

    ipcMain.handle(
      'studio:removeWorkspaceHistoryItem',
      (
        event,
        arg: WorkspaceTypes.RemoveWorkspaceHistoryItemArgs
      ): WorkspaceTypes.WorkspaceResponse => {
        const { folderUri } = arg;
        if (folderUri) {
          this.workspacesHistoryService.removeWorkspaceHistoryItem(folderUri);
          return {
            status: WorkspaceTypes.WorkspaceStatusType.SUCCESS,
            data: '',
          };
        }
        return {
          status: WorkspaceTypes.WorkspaceStatusType.ERROR,
          data: '[Error] Invalid folder uri.',
        };
      }
    );
  }
}
