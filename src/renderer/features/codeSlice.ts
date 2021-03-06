import { TerraformType } from '@renderer/types/terraform';
import { JSONSchema7 } from 'json-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';

export interface ObjcectInfo {
  type: TerraformType;
  resourceName: string;
  instanceName: string;
  content: any;
  sourceSchema: JSONSchema7;
}
interface CodeSlice {
  fileObjects: WorkspaceTypes.TerraformFileJsonMeta[];
  selectedObjectInfo: ObjcectInfo;
  mapObjectTypeCollection: any;
}

const initialState: CodeSlice = {
  fileObjects: [],
  mapObjectTypeCollection: {},
  selectedObjectInfo: {
    type: '' as TerraformType,
    resourceName: '',
    instanceName: '',
    content: {},
    sourceSchema: {},
  },
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setFileObjects: (state, action: PayloadAction<any>) => {
      state.fileObjects = action.payload; //_.defaultsDeep(action.payload); <- 자동으로 내부적으로 immer로 불변성 유지해준다고 함.
    },
    setMapObjectTypeCollection: (state, action: PayloadAction<any>) => {
      state.mapObjectTypeCollection = action.payload;
    },
    setSelectedObjectInfo: (state, action: PayloadAction<any>) => {
      state.selectedObjectInfo = action.payload;
    },
    setSelectedContent: (state, action: PayloadAction<any>) => {
      state.selectedObjectInfo.content = action.payload;
    },
    setSelectedSourceSchema: (state, action: PayloadAction<any>) => {
      state.selectedObjectInfo.sourceSchema = action.payload;
    },
  },
});

export const {
  setFileObjects,
  setMapObjectTypeCollection,
  setSelectedObjectInfo,
  setSelectedContent,
  setSelectedSourceSchema,
} = codeSlice.actions;

export default codeSlice.reducer;
