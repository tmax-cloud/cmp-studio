import { RootState } from '@renderer/app/store';

export const selectUiToggleSidePanel = (state: RootState) =>
  state.ui.isSidePanelOpen;
export const selectFileDirty = (state: RootState) => state.ui.fileDirty;
