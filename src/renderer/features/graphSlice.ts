import * as _ from 'lodash';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGraphData, QUICK_START } from '@renderer/utils/graph';
import { GraphData } from 'react-force-graph-2d';
import { NodeData } from '@renderer/types/graph';

interface GraphState {
  graphData: GraphData; // 전체 그래프 데이터
  selectedData: GraphData; // 선택한 모듈 하위 그래프 데이터
  selectedNode: NodeData | null; // 선택한 노드
  selectedModule: NodeData | null; // 선택한 모듈 모드
  errorMsg: string | null; // 에러 메시지
  loadingMsg: string | null; // 로딩 메시지
}

const initialState: GraphState = {
  graphData: { nodes: [], links: [] },
  selectedData: { nodes: [], links: [] },
  selectedNode: null,
  selectedModule: null,
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
    setSelectedData: (state, { payload }) => {
      state.selectedData = payload;
    },
    setSelectedNode: (state, { payload }) => {
      state.selectedNode = payload;
    },
    setSelectedModule: (state, { payload }) => {
      state.selectedModule = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGraphData.pending, (state, { payload }) => {
      state.loadingMsg = '테라폼 그래프를 불러오는 중입니다.';
    });
    builder.addCase(fetchGraphData.fulfilled, (state, { payload }) => {
      state.graphData = payload as GraphData;
      state.selectedData = payload as GraphData;
      state.errorMsg = _.isEmpty(state.graphData.nodes) ? QUICK_START : null;
      state.loadingMsg = null;
    });
    builder.addCase(fetchGraphData.rejected, (state, { payload }) => {
      state.graphData = { nodes: [], links: [] };
      state.selectedData = { nodes: [], links: [] };
      state.errorMsg = payload as string;
      state.loadingMsg = null;
    });
  },
});

export const { setSelectedData, setSelectedNode, setSelectedModule } =
  graphSlice.actions;

export default graphSlice.reducer;
