import fs from 'fs';
import path from 'path';
import { ipcMain } from 'electron';
import {
  createFile,
  writeFileJson,
  readFileJson,
} from '../../base/common/fileUtils';
import { getUserDataFolderPath } from '../../base/common/pathUtils';
import { StorageMainServiceInterface } from '../common/storage';

const STORAGE_PATH = path.join(getUserDataFolderPath(), 'storage.json');

export class StorageMainService implements StorageMainServiceInterface {
  constructor() {
    this.init();
    this.registerListeners();
  }

  private init(): void {
    if (!fs.existsSync(STORAGE_PATH)) {
      createFile(STORAGE_PATH);
      this.writeStorage({});
    }
  }

  private readStorage() {
    return readFileJson(STORAGE_PATH);
  }

  private writeStorage(obj: any) {
    writeFileJson(STORAGE_PATH, obj);
  }

  setItem(key: string, data: any) {
    const storageJson = this.readStorage();
    storageJson[key] = data;
    this.writeStorage(storageJson);
  }

  setItems(items: { key: string; data: any }[]) {
    const storageJson = this.readStorage();
    items.forEach((item) => {
      storageJson[item.key] = item.data;
    });
    this.writeStorage(storageJson);
  }

  getItem(key: string): any {
    const storageJson = this.readStorage();
    return storageJson[key];
  }

  private registerListeners(): void {
    ipcMain.on(
      'studio:setStorageItem',
      (event, arg: { key: string; data: any }) => {
        if (!!arg.key && !!arg.data) {
          this.setItem(arg.key, arg.data);
        }
      }
    );

    ipcMain.on(
      'studio:setStorageItems',
      (event, arg: { items: { key: string; data: any }[] }) => {
        if (Array.isArray(arg.items)) {
          this.setItems(arg.items);
        }
      }
    );

    ipcMain.handle('studio:getStorageItem', (event, arg: { key: string }) => {
      return this.getItem(arg.key);
    });
  }
}
