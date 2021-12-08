import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiSlice {
  isSidePanelOpen: boolean;
  fileDirty: boolean;
}

const initialState: UiSlice = {
  isSidePanelOpen: false,
  fileDirty: false,
};

const uiSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setSidePanel: (state, action: PayloadAction<any>) => {
      state.isSidePanelOpen = action.payload;
    },
    setFileDirty: (state, action: PayloadAction<any>) => {
      state.fileDirty = action.payload;
    },
  },
});

export const { setSidePanel, setFileDirty } = uiSlice.actions;

export default uiSlice.reducer;
