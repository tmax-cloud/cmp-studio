import { RootState } from '@renderer/app/store';

export const selectUiToggleSidePanel = (state: RootState) =>
  state.ui.isSidePanelOpen;
