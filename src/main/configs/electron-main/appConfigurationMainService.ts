import fs from 'fs';
import { ipcMain } from 'electron';
import {
  createFile,
  writeFileJson,
  readFileJson,
} from '../../base/common/fileUtils';
import { getConfigsPath } from '../../base/common/pathUtils';
import { AppConfigurationMainServiceInterface } from '../common/configuration';

const APP_SETTING_PATH = getConfigsPath('AppSettings.json');

export class AppConfigurationMainService
  implements AppConfigurationMainServiceInterface
{
  constructor() {
    this.init();
    this.registerListeners();
  }

  init(): void {
    if (!fs.existsSync(APP_SETTING_PATH)) {
      createFile(APP_SETTING_PATH);
      writeFileJson(APP_SETTING_PATH, { initialAppSettingTest: 'test' });
    }
  }

  private readAppConfig() {
    return readFileJson(APP_SETTING_PATH);
  }

  private writeAppConfig(obj: any) {
    writeFileJson(APP_SETTING_PATH, obj);
  }

  setItem(key: string, data: any) {
    const appConfigJson = this.readAppConfig();
    appConfigJson[key] = data;
    this.writeAppConfig(appConfigJson);
  }

  setItems(items: { key: string; data: any }[]) {
    const appConfigJson = this.readAppConfig();
    items.forEach((item) => {
      appConfigJson[item.key] = item.data;
    });
    this.writeAppConfig(appConfigJson);
  }

  getItem(key: string): any {
    const appConfigJson = this.readAppConfig();
    return appConfigJson[key];
  }

  private registerListeners(): void {
    ipcMain.on(
      'studio:setAppConfigItem',
      (event, arg: { key: string; data: any }) => {
        if (!!arg.key && !!arg.data) {
          this.setItem(arg.key, arg.data);
        }
      }
    );

    ipcMain.on(
      'studio:setAppConfigItems',
      (event, arg: { items: { key: string; data: any }[] }) => {
        if (Array.isArray(arg.items)) {
          this.setItems(arg.items);
        }
      }
    );

    ipcMain.handle('studio:getAppConfigItem', (event, arg: { key: string }) => {
      return this.getItem(arg.key);
    });
  }
}
