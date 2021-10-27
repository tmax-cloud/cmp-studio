import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';

interface ObjcectInfo {
  id: string;
  content: any;
}
interface CodeSlice {
  fileObjects: WorkspaceTypes.TerraformFileJsonMeta[];
  selectedObjectInfo: ObjcectInfo;
}

const initialState: CodeSlice = {
  fileObjects: [],
  selectedObjectInfo: {
    id: '',
    content: {},
  },
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setInitObjects: (state, action: PayloadAction<any>) => {
      state.objects = action.payload; //_.defaultsDeep(action.payload); <- 자동으로 내부적으로 immer로 불변성 유지해준다고 함.
    },
    setSelectedObjectInfo: (state, action: PayloadAction<any>) => {
      state.selectedObjectInfo = action.payload;
    },
    addSelectedField: (state, action: PayloadAction<any>) => {
      state.selectedObjectInfo.content = action.payload;
    },
  },
});

export const { setInitObjects, setSelectedObjectInfo, addSelectedField } =
  codeSlice.actions;

export default codeSlice.reducer;
