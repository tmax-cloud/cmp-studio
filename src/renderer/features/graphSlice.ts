import * as _ from 'lodash';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getGraphData,
  getTerraformData,
  QUICK_START,
} from '@renderer/utils/graph';
import { GraphData } from 'react-force-graph-2d';
import { NodeData } from '@renderer/types/graph';
import { setSidePanel } from './uiSlice';

interface GraphState {
  terraformData: string; // 테라폼 그래프 데이터
  graphData: GraphData; // 전체 그래프 데이터
  selectedData: GraphData; // 선택한 모듈 하위 그래프 데이터
  selectedNode: NodeData | null; // 선택한 노드
  selectedModule: NodeData | null; // 선택한 모듈 모드
  errorMsg: string | null; // 에러 메시지
  loadingMsg: string | null; // 로딩 메시지
}

const initialState: GraphState = {
  terraformData: '',
  graphData: { nodes: [], links: [] },
  selectedData: { nodes: [], links: [] },
  selectedNode: null,
  selectedModule: null,
  errorMsg: null,
  loadingMsg: null,
};

export const fetchGraphDataByTerraform = createAsyncThunk(
  'graph/fetchGraphDataByTerraform',
  async (rawData: string, { dispatch, rejectWithValue }) => {
    try {
      const data = await getGraphData(rawData);
      return data;
    } catch (error) {
      const { message } = error as Error;
      dispatch(setSidePanel(false));
      return rejectWithValue(message);
    }
  }
);

export const fetchGraphDataByWorkspaceId = createAsyncThunk(
  'graph/fetchGraphDataByWorkspaceId',
  async (workspaceUid: string, { dispatch, rejectWithValue }) => {
    try {
      const data = await getTerraformData(workspaceUid);
      dispatch(fetchGraphDataByTerraform(data));
      return data;
    } catch (error) {
      const { message } = error as Error;
      dispatch(setSidePanel(false));
      return rejectWithValue(message);
    }
  }
);

export const watchGraphData = createAsyncThunk(
  'graph/watchGraphData',
  async (workspaceUid: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const data = await getTerraformData(workspaceUid);
      const { terraformData } = (getState() as any).graph as GraphState;
      if (data !== terraformData) {
        dispatch(fetchGraphDataByWorkspaceId(workspaceUid));
      }
      return data;
    } catch (error) {
      const { message } = error as Error;
      dispatch(setSidePanel(false));
      return rejectWithValue(message);
    }
  }
);

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setTerraformDataData: (state, { payload }) => {
      state.terraformData = payload;
    },
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
    // watchGraphData
    builder.addCase(watchGraphData.rejected, (state, { payload }) => {
      state.errorMsg = payload as string;
    });
    // fetchGraphDataByWorkspaceId
    builder.addCase(
      fetchGraphDataByWorkspaceId.pending,
      (state, { payload }) => {
        state.loadingMsg = '테라폼 그래프를 불러오는 중입니다.';
        state.selectedNode = null;
        state.selectedModule = null;
      }
    );
    builder.addCase(
      fetchGraphDataByWorkspaceId.fulfilled,
      (state, { payload }) => {
        state.terraformData = payload as string;
        state.errorMsg = null;
      }
    );
    builder.addCase(
      fetchGraphDataByWorkspaceId.rejected,
      (state, { payload }) => {
        state.terraformData = '';
        state.loadingMsg = null;
        state.errorMsg = payload as string;
      }
    );
    // fetchGraphDataByTerraform
    builder.addCase(
      fetchGraphDataByTerraform.fulfilled,
      (state, { payload }) => {
        state.graphData = payload as GraphData;
        state.selectedData = payload as GraphData;
        state.errorMsg = _.isEmpty(state.graphData.nodes) ? QUICK_START : null;
        state.loadingMsg = null;
      }
    );
    builder.addCase(
      fetchGraphDataByTerraform.rejected,
      (state, { payload }) => {
        state.graphData = { nodes: [], links: [] };
        state.selectedData = { nodes: [], links: [] };
        state.errorMsg = payload as string;
        state.loadingMsg = null;
      }
    );
  },
});

export const {
  setTerraformDataData,
  setSelectedData,
  setSelectedNode,
  setSelectedModule,
} = graphSlice.actions;

export default graphSlice.reducer;
