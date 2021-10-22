import { IPCResponse } from '../../base/common/ipc';
export const TERRAFORM_EXE_PATH_KEY = 'terraformExePath';

export type AppConfigGetItemArgs = {
  key: string;
};
export enum ConfigStatusType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
export type ConfigStatus = ConfigStatusType.SUCCESS | ConfigStatusType.ERROR;

export type ConfigData = any;

export type ConfigResponse = IPCResponse<ConfigStatus, ConfigData>;
export interface AppConfigurationMainServiceInterface {
  setItem(key: string, data: any): void;
  setItems(items: { key: string; data: any }[]): void;
  getItem(key: string): any;
}
