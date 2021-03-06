import { RootState } from '@renderer/app/store';
import { NodeData } from '@renderer/types/graph';
import { GraphData } from 'react-force-graph-2d';

export const selectTerraformData = (state: RootState): string =>
  state.graph.terraformData;
export const selectGraphData = (state: RootState): GraphData =>
  state.graph.graphData;
export const selectSelectedData = (state: RootState): GraphData =>
  state.graph.selectedData;
export const selectSelectedNode = (state: RootState): NodeData | null =>
  state.graph.selectedNode;
export const selectSelectedModule = (state: RootState): NodeData | null =>
  state.graph.selectedModule;
export const selectFilterNodes = (state: RootState): NodeData[] | null =>
  state.graph.filterNodes;
export const selectErrorMsg = (state: RootState): string | null =>
  state.graph.errorMsg;
