import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import * as _ from 'lodash-es';

interface CommonSlice {
  workspaceUid: string;
}

const initialState: CommonSlice = {
  workspaceUid: '',
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setWorkspaceUid: (state, action: PayloadAction<string>) => {
      state.workspaceUid = action.payload;
    },
  },
});

export const { setWorkspaceUid } = commonSlice.actions;

export default commonSlice.reducer;
