import { RootState } from '@renderer/app/store';

export const selectGraphData = (state: RootState) => state.graph.graphData;
export const selectSelectedNode = (state: RootState) =>
  state.graph.selectedNode;
export const selectErrorMsg = (state: RootState) => state.graph.errorMsg;
export const selectLoadingMsg = (state: RootState) => state.graph.loadingMsg;
