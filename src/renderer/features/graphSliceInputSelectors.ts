import { RootState } from '@renderer/app/store';

export const selectGraphData = (state: RootState) => state.graph.graphData;
export const selectSelectedData = (state: RootState) =>
  state.graph.selectedData;
export const selectSelectedNode = (state: RootState) =>
  state.graph.selectedNode;
export const selectSelectedModulePath = (state: RootState) =>
  state.graph.selectedModulePath;
export const selectErrorMsg = (state: RootState) => state.graph.errorMsg;
export const selectLoadingMsg = (state: RootState) => state.graph.loadingMsg;
