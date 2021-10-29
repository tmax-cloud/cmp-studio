import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGraphData } from '@renderer/utils/graph';
import { GraphData } from 'react-force-graph-2d';

interface GraphState {
  graphData: GraphData;
  errorMsg: string | null;
}

const initialState: GraphState = {
  graphData: { nodes: [], links: [] },
  errorMsg: null,
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGraphData.fulfilled, (state, { payload }) => {
      state.graphData = payload as GraphData;
      state.errorMsg = null;
    });
    builder.addCase(fetchGraphData.rejected, (state, { payload }) => {
      state.graphData = { nodes: [], links: [] };
      state.errorMsg = payload as string;
    });
  },
});

export default graphSlice.reducer;
