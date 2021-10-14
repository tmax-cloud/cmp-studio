export enum OpenType {
  OPEN_FOLDER = 'OPEN_FOLDER',
  CREATE_NEW_PROJECT = 'CREATE_NEW_PROJECT',
}
export type OptionProperties = Array<
  | 'openFile'
  | 'openDirectory'
  | 'multiSelections'
  | 'showHiddenFiles'
  | 'createDirectory'
  | 'promptToCreate'
  | 'noResolveAliases'
  | 'treatPackageAsDirectory'
  | 'dontAddToRecent'
>;

export type OpenDialogArgs = {
  openTo: OpenType;
  properties: OptionProperties;
};
