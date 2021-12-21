import { RootState } from '@renderer/app/store';

export const selectCommandLoadingMsg = (state: RootState) =>
  state.command.loadingMsg;

export const selectCommandErrorMsg = (state: RootState) =>
  state.command.errorMsg;

export const selectCommandTerraformResponseData = (state: RootState) =>
  state.command.terraformResponseData;
