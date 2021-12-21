import { RootState } from '@renderer/app/store';

export const selectUiToggleSidePanel = (state: RootState) =>
  state.ui.isSidePanelOpen;
export const selectFileDirty = (state: RootState) => state.ui.fileDirty;

export const selectUiCommandPage = (state: RootState) =>
  state.ui.isCommandPageOpen;

export const selectUiLoadingModal = (state: RootState) =>
  state.ui.isLoadingModalOpen;

export const selectUiLoadingMsg = (state: RootState) => state.ui.loadingMsg;
