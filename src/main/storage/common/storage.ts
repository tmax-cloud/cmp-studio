export interface IStorageMainService {
  setItem(key: string, data: any): void;
  setItems(items: { key: string; data: any }[]): void;
  getItem(key: string): any;
}
