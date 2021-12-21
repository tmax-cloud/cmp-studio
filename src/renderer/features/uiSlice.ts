import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiSlice {
  isSidePanelOpen: boolean;
  fileDirty: boolean;
  isCommandPageOpen: boolean;
  isLoadingModalOpen: boolean;
  loadingMsg: string | null; // 로딩 메시지
}

const initialState: UiSlice = {
  isSidePanelOpen: false,
  fileDirty: false,
  isCommandPageOpen: false,
  isLoadingModalOpen: false,
  loadingMsg: null,
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
    setCommandPage: (state, action: PayloadAction<boolean>) => {
      state.isCommandPageOpen = action.payload;
    },
    setLoadingModal: (state, action: PayloadAction<boolean>) => {
      state.isLoadingModalOpen = action.payload;
    },
    setLoadingMsg: (state, action: PayloadAction<string | null>) => {
      state.loadingMsg = action.payload;
    },
  },
});

export const {
  setSidePanel,
  setFileDirty,
  setCommandPage,
  setLoadingModal,
  setLoadingMsg,
} = uiSlice.actions;

export default uiSlice.reducer;
