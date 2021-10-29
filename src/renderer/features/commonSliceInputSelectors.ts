import { RootState } from '@renderer/app/store';

export const selectWorkspaceUid = (state: RootState) =>
  state.common.workspaceUid;
