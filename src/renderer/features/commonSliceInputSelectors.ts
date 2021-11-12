import { RootState } from '@renderer/app/store';

export const selectWorkspaceUid = (state: RootState) =>
  state.common.workspaceUid;

export const selectTerraformState = (state: RootState) =>
  state.common.terraformState.planData;
