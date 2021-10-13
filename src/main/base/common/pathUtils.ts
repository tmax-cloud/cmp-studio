import path from 'path';
import { app } from 'electron';

const PRODUCT_NAME = 'CMPStudio';
export const SRC_MAIN_PATH = path.join(__dirname, '../../');

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const CONFIGS_PATH = app.isPackaged
  ? path.join(app.getPath('appData'), 'Config')
  : path.join(__dirname, '../../../../TestMeta/Config');

export const getConfigsPath = (...paths: string[]): string => {
  return path.join(CONFIGS_PATH, ...paths);
};

export function getUserDataFolderPath() {
  if (app.isPackaged) {
    return path.join(app.getPath('appData'), PRODUCT_NAME);
  }
  return path.join(__dirname, '../../../../TestMeta');
}

export const getWorkspaceMetaFolderPath = () => {
  return path.join(getUserDataFolderPath(), 'Workspaces');
};

export const getDocumentsPath = () => {
  return path.join(app.getPath('documents'), `${PRODUCT_NAME}Projects`);
};
