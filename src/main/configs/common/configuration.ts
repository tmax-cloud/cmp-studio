export interface AppConfigurationMainServiceInterface {
  setItem(key: string, data: any): void;
  setItems(items: { key: string; data: any }[]): void;
  getItem(key: string): any;
}
