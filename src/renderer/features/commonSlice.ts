import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import * as _ from 'lodash-es';

type TerraformStateType = {
  status: string;
  data: string;
  message: string;
};

interface CommonSlice {
  workspaceUid: string;
  terraformState: any;
}

const initialState: CommonSlice = {
  workspaceUid: '',
  terraformState: {
    status: '',
    data: '',
    message: '',
  },
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setWorkspaceUid: (state, action: PayloadAction<string>) => {
      state.workspaceUid = action.payload;
    },
    setTerraformState: (state, action: PayloadAction<any>) => {
      state.terraformState = action.payload;
    },
  },
});

export const { setWorkspaceUid, setTerraformState } = commonSlice.actions;

export default commonSlice.reducer;
