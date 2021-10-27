export const IS_FIRST_RUN_KEY = 'isFirstRun';

export type StorageGetItemArgs = {
  key: string;
};

export type StorageSetItemArgs = { key: string; data: any };

export type StorageSetItemsArgs = {
  items: StorageSetItemArgs[];
};

export interface StorageMainServiceInterface {
  setItem(key: string, data: any): void;
  setItems(items: { key: string; data: any }[]): void;
  getItem(key: string): any;
}
