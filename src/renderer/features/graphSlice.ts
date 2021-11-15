import * as _ from 'lodash';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGraphData, QUICK_START } from '@renderer/utils/graph';
import { GraphData } from 'react-force-graph-2d';
import { NodeData } from '@renderer/types/graph';

interface GraphState {
  graphData: GraphData;
  selectedNode: NodeData | null;
  errorMsg: string | null;
  loadingMsg: string | null;
}

const initialState: GraphState = {
  graphData: { nodes: [], links: [] },
  selectedNode: null,
  errorMsg: null,
  loadingMsg: null,
};

export const fetchGraphData = createAsyncThunk(
  'graph/fetchByWorkspaceUid',
  async (workspaceUid: string, { rejectWithValue }) => {
    try {
      const data = await getGraphData(workspaceUid);
      return data;
    } catch (error) {
      const { message } = error as Error;
      return rejectWithValue(message);
    }
  }
);

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setSelectedNode: (state, { payload }) => {
      state.selectedNode = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGraphData.pending, (state, { payload }) => {
      state.loadingMsg = '테라폼 그래프를 불러오는 중입니다.';
    });
    builder.addCase(fetchGraphData.fulfilled, (state, { payload }) => {
      state.graphData = payload as GraphData;
      state.errorMsg = _.isEmpty(state.graphData.nodes) ? QUICK_START : null;
      state.loadingMsg = null;
    });
    builder.addCase(fetchGraphData.rejected, (state, { payload }) => {
      state.graphData = { nodes: [], links: [] };
      state.errorMsg = payload as string;
      state.loadingMsg = null;
    });
  },
});

export const { setSelectedNode } = graphSlice.actions;

export default graphSlice.reducer;
