export enum OpenType {
  OPEN_FOLDER = 'OPEN_FOLDER',
  CREATE_NEW_PROJECT = 'CREATE_NEW_PROJECT',
  SELECT_TF_EXE = 'SELECT_TF_EXE',
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
