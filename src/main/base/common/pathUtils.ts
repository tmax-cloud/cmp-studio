import path from 'path';
import { app } from 'electron';

const APP_DATA_PRODUCT_ROOT = 'cmp-studio';
const PRODUCT_NAME = 'CMP Studio';
export const SRC_MAIN_PATH = path.join(__dirname, '../../');

const APP_DATA_PRODUCT_ROOT_PATH = path.join(
  app.getPath('appData'),
  APP_DATA_PRODUCT_ROOT,
  PRODUCT_NAME
);

export function getUserDataFolderPath() {
  if (app.isPackaged) {
    return APP_DATA_PRODUCT_ROOT_PATH;
  }
  return path.join(__dirname, '../../../../TestMeta');
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const CONFIGS_PATH = path.join(getUserDataFolderPath(), 'Config');

export const getConfigsPath = (...paths: string[]): string => {
  return path.join(CONFIGS_PATH, ...paths);
};

export const getWorkspaceMetaFolderPath = () => {
  return path.join(getUserDataFolderPath(), 'Workspaces');
};

export const getDocumentsPath = () => {
  return path.join(app.getPath('documents'), `${PRODUCT_NAME}Projects`);
};
