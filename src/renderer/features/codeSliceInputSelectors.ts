import { RootState } from '@renderer/app/store';

export const selectCodeFileObjects = (state: RootState) =>
  state.code.fileObjects;

export const selectMapObjectTypeCollection = (state: RootState) =>
  state.code.mapObjectTypeCollection;

export const selectCodeSelectedObjectInfoId = (state: RootState) =>
  state.code.selectedObjectInfo.id;

export const selectCodeSelectedObjectInfoInstanceName = (state: RootState) =>
  state.code.selectedObjectInfo.instanceName;

export const selectCode = (state: RootState) => state.code;

export const selectCodeSelectedObjectInfoSourceSchema = (state: RootState) =>
  state.code.selectedObjectInfo.sourceSchema;

export const selectCodeSelectedObjectInfo = (state: RootState) =>
  state.code.selectedObjectInfo;
