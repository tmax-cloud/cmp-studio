import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  createFile,
  readFileJson,
  writeFileJson,
} from '../../base/common/fileUtils';
import {
  WorkspaceIdentifier,
  WorkspaceManagementServiceInterface,
} from '../common/workspace';
import { getWorkspaceMetaFolderPath } from '../../base/common/pathUtils';

const WORKSPACE_MAP_PATH = 'workspaceMap.json';
const WORKSPACE_CONFIG_PATH = 'workspace.json';
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

  getWorkspaceConfig(uid: string) {
    const configPath = getWorkspaceConfigPath(uid);
    if (!fs.existsSync(configPath)) {
      throw new Error(`[Error] There is no workspace config : ${configPath}`);
    }
    return readFileJson(configPath);
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
      const workspaceMetaPath = path.join(getWorkspaceMetaFolderPath(), key);
      fs.rmdirSync(workspaceMetaPath, { recursive: true });
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
}
