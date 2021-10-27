import { RootState } from '@renderer/app/store';

export const selectCodeFileObjects = (state: RootState) =>
  state.code.fileObjects;

export const selectCode = (state: RootState) => state.code;
