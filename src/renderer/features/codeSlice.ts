import { JSONSchema7 } from 'json-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';

interface ObjcectInfo {
  id: string;
  instanceName: string;
  content: any;
  sourceSchema: JSONSchema7;
}
interface CodeSlice {
  fileObjects: WorkspaceTypes.TerraformFileJsonMeta[];
  fileSchema: JSONSchema7[];
  selectedObjectInfo: ObjcectInfo;
  mapObjectTypeCollection: any;
}

const initialState: CodeSlice = {
  fileObjects: [],
  fileSchema: [],
  mapObjectTypeCollection: {},
  selectedObjectInfo: {
    id: '',
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
    setFileSchema: (state, action: PayloadAction<any>) => {
      state.fileSchema = action.payload;
    },
    setMapObjectTypeCollection: (state, action: PayloadAction<any>) => {
      state.mapObjectTypeCollection = action.payload;
    },
    setSelectedObjectInfo: (state, action: PayloadAction<any>) => {
      state.selectedObjectInfo = action.payload;
    },
    addSelectedField: (state, action: PayloadAction<any>) => {
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
  addSelectedField,
  setSelectedSourceSchema,
  setFileSchema,
} = codeSlice.actions;

export default codeSlice.reducer;
