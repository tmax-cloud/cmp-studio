import { RootState } from '@renderer/app/store';

export const selectCommandPlanResponseData = (state: RootState) =>
  state.command.planResponseData;

export const selectCommandLoadingMsg = (state: RootState) =>
  state.command.loadingMsg;

export const selectCommandErrorMsg = (state: RootState) =>
  state.command.errorMsg;
