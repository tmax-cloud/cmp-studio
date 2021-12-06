import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  copyDir,
  createFile,
  readFileJson,
  writeFileJson,
} from '../../base/common/fileUtils';
import {
  WorkspaceIdentifier,
  WorkspaceManagementServiceInterface,
} from '../common/workspace';
import {
  getWorkspaceMetaFolderPath,
  getDocumentsPath,
} from '../../base/common/pathUtils';

const WORKSPACE_MAP_PATH = 'workspaceMap.json';
const WORKSPACE_CONFIG_PATH = 'workspace.json';
const TEMPORARYDATA_FOLDER_PATH = 'Temporary';
export const workspaceMapPath = path.join(
  getWorkspaceMetaFolderPath(),
  WORKSPACE_MAP_PATH
);
export const getWorkspaceConfigPath = (uid: string) => {
  return path.join(getWorkspaceMetaFolderPath(), uid, WORKSPACE_CONFIG_PATH);
};

export class WorkspaceManagementService
  implements WorkspaceManagementServiceInterface
{
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(workspaceMapPath)) {
      createFile(workspaceMapPath);
      writeFileJson(workspaceMapPath, {});
    }
  }

  checkRealWorkspaceExists(workspaceRealPath: string): boolean {
    return fs.existsSync(workspaceRealPath);
  }

  checkWorkspaceMetaExsits(uid: string) {
    return fs.existsSync(path.join(getWorkspaceMetaFolderPath(), uid));
  }

  writeWorkspaceConfig(uid: string, obj: any) {
    const configPath = getWorkspaceConfigPath(uid);
    if (fs.existsSync(configPath)) {
      writeFileJson(configPath, obj);
    }
  }

  getWorkspaceConfig(uid: string) {
    const configPath = getWorkspaceConfigPath(uid);
    if (!fs.existsSync(configPath)) {
      throw new Error(`[Error] There is no workspace config : ${configPath}`);
    }
    return readFileJson(configPath);
  }

  setWorkspaceConfigItem(uid: string, key: string, data: any) {
    const configJson = this.getWorkspaceConfig(uid);
    configJson[key] = data;
    this.writeWorkspaceConfig(uid, configJson);
  }

  createNewWorkspaceMeta(workspaceRealPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const uid = uuidv4();
        createFile(getWorkspaceConfigPath(uid));
        const workspaceConfig: WorkspaceIdentifier = {
          id: uid,
          workspaceRealPath,
          isPinned: false,
          terraformExePath: 'EMPTY',
        };
        writeFileJson(getWorkspaceConfigPath(uid), workspaceConfig);
        const workspaceMap = readFileJson(workspaceMapPath);
        workspaceMap[uid] = workspaceRealPath;
        writeFileJson(workspaceMapPath, workspaceMap);
        resolve(uid);
      } catch (err) {
        reject(err);
      }
    });
  }

  checkWorkspacePathUnique(workspaceRealPath: string): boolean {
    const workspaceMap = readFileJson(workspaceMapPath);
    const uidArray = Object.entries(workspaceMap);
    const result = uidArray.filter(([key, value]) => {
      return value === workspaceRealPath;
    });
    return result.length < 1;
  }

  // MEMO : 폴더를 지우고 workspacemeta는 남아있는 상태에서 다시 폴더를 생성했을 때,
  // MEMO : workspacemeta도 새로 갱신해주는 함수
  removeOldWorkspaceMeta(workspaceRealPath: string) {
    const workspaceMap = readFileJson(workspaceMapPath);
    const duplicateKeys: string[] = [];
    Object.keys(workspaceMap)?.forEach((key) => {
      if (workspaceMap[key] === workspaceRealPath) {
        duplicateKeys.push(key);
      }
    });
    duplicateKeys.forEach((key) => {
      delete workspaceMap[key];
    });
    writeFileJson(workspaceMapPath, workspaceMap);
  }

  // MEMO : 존재하지 않는 폴더경로에 대한 workspace meta들을 지워주는 함수
  removeGhostWorkspaceMeta(workspaceRealPath: string) {
    const workspaceMap = readFileJson(workspaceMapPath);
    const duplicateKeys: string[] = [];
    Object.keys(workspaceMap)?.forEach((key) => {
      if (workspaceMap[key] === workspaceRealPath) {
        duplicateKeys.push(key);
      }
    });
    duplicateKeys.forEach((key) => {
      delete workspaceMap[key];
      if (key?.split('-').length === 5) {
        // MEMO : 다른 폴더 지울 위험 방지위해 key형태로 한번 validation 해줌
        const workspaceMetaPath = path.join(getWorkspaceMetaFolderPath(), key);
        fs.rmdirSync(workspaceMetaPath, { recursive: true });
      }
    });
    writeFileJson(workspaceMapPath, workspaceMap);
  }

  getWorkspaceIdByFolderUri(folderUri: string): string | null {
    const workspaceMap = readFileJson(workspaceMapPath);
    const uids: string[] = [];
    Object.keys(workspaceMap)?.forEach((key) => {
      if (workspaceMap[key] === folderUri) {
        uids.push(key);
      }
    });

    switch (uids.length) {
      case 1:
        return uids[0];
      case 0:
        return null;
      default:
        throw new Error('[Error] Duplicate folderUri in workspaceMap');
    }
  }

  getFolderUriByWorkspaceId(workspaceId: string): string | null {
    const workspaceMap = readFileJson(workspaceMapPath);
    const folderUris: string[] = [];
    Object.keys(workspaceMap)?.forEach((key) => {
      if (key === workspaceId) {
        folderUris.push(workspaceMap[key]);
      }
    });

    switch (folderUris.length) {
      case 1:
        return folderUris[0];
      case 0:
        return null;
      default:
        throw new Error('[Error] Duplicate folderUri in workspaceMap');
    }
  }

  getFolderNameByWorkspaceId(workspaceId: string): string | null {
    const workspaceMap = readFileJson(workspaceMapPath);
    let folderName = null;
    Object.keys(workspaceMap)?.forEach((key) => {
      if (key === workspaceId) {
        folderName = workspaceMap[key].split(path.sep).pop();
      }
    });
    return folderName;
  }

  generateDefaultNewWorkspaceName(): string {
    let index = 1;
    let newWorkspaceName = `새프로젝트${index}`;
    let ok = false;
    while (!ok) {
      if (fs.existsSync(path.join(getDocumentsPath(), newWorkspaceName))) {
        index += 1;
        newWorkspaceName = `새프로젝트${index}`;
      } else {
        ok = true;
      }
    }
    return newWorkspaceName;
  }

  getWorkspaceTemporaryFolderPath(workspaceId: string): string {
    return path.join(
      getWorkspaceMetaFolderPath(),
      workspaceId,
      TEMPORARYDATA_FOLDER_PATH
    );
  }

  getRealOrTempFolderPath(workspaceId: string): string {
    const folderPath = this.getWorkspaceConfig(workspaceId).workspaceRealPath;
    const tempFolderPath = this.getWorkspaceTemporaryFolderPath(workspaceId);
    const path = fs.existsSync(tempFolderPath) ? tempFolderPath : folderPath;
    return path;
  }

  copyRealToTempFolder(workspaceId: string): void {
    const folderPath = this.getWorkspaceConfig(workspaceId).workspaceRealPath;
    const tempFolderPath = this.getWorkspaceTemporaryFolderPath(workspaceId);
    copyDir(folderPath, tempFolderPath);
  }
}
