import * as _ from 'lodash';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getGraphData,
  getTerraformData,
  LOADING,
  QUICK_START,
} from '@renderer/utils/graph';
import { GraphData } from 'react-force-graph-2d';
import { NodeData } from '@renderer/types/graph';
import { setSidePanel, setLoadingMsg } from './uiSlice';

interface GraphState {
  terraformData: string; // 테라폼 그래프 데이터
  graphData: GraphData; // 전체 그래프 데이터
  selectedData: GraphData; // 선택한 모듈 하위 그래프 데이터
  selectedNode: NodeData | null; // 선택한 노드
  selectedModule: NodeData | null; // 선택한 모듈 모드
  filterNodes: NodeData[] | null; // 검색 시 필터링된 노드
  errorMsg: string | null; // 에러 메시지
}

interface Data {
  terraform: string;
  graph: GraphData;
}

const initialState: GraphState = {
  terraformData: '',
  graphData: { nodes: [], links: [] },
  selectedData: { nodes: [], links: [] },
  selectedNode: null,
  selectedModule: null,
  filterNodes: null,
  errorMsg: null,
};

// 테라폼 데이터를 가공한 그래프 데이터 가져오기
export const fetchGraphDataByTerraform = createAsyncThunk(
  'graph/fetchGraphDataByTerraform',
  async (rawData: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoadingMsg(LOADING));
      const data = await getGraphData(rawData);
      return data;
    } catch (error) {
      const { message } = error as Error;
      dispatch(setSidePanel(false));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoadingMsg(null));
    }
  }
);

// 테라폼 데이터 및 가공한 그래프 데이터 가져오기
export const fetchGraphDataByWorkspaceId = createAsyncThunk(
  'graph/fetchGraphDataByWorkspaceId',
  async (workspaceUid: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoadingMsg(LOADING));
      const data = await getTerraformData(workspaceUid);
      dispatch(fetchGraphDataByTerraform(data));
      return data;
    } catch (error) {
      const { message } = error as Error;
      dispatch(setSidePanel(false));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoadingMsg(null));
    }
  }
);

// 이전 테라폼 데이터와 비교하여, 다를 경우 그래프 데이터 가져오기
export const watchGraphData = createAsyncThunk(
  'graph/watchGraphData',
  async (workspaceUid: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const newTerraformData = await getTerraformData(workspaceUid);
      const { terraformData } = (getState() as any).graph as GraphState;
      if (newTerraformData !== terraformData) {
        const newGraphData = await getGraphData(newTerraformData);
        return {
          terraform: newTerraformData,
          graph: newGraphData,
        };
      }
      return null;
    } catch (error) {
      const { message } = error as Error;
      dispatch(setSidePanel(false));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoadingMsg(null));
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
    setFilterNodes: (state, { payload }) => {
      state.filterNodes = payload;
    },
  },
  extraReducers: (builder) => {
    // watchGraphData: 데이터 가져오기 및 에러 상황 처리
    builder.addCase(watchGraphData.fulfilled, (state, { payload }) => {
      if (payload) {
        state.terraformData = (payload as Data).terraform;
        state.graphData = (payload as Data).graph;
        state.selectedData = (payload as Data).graph;
        state.errorMsg = _.isEmpty(state.graphData.nodes) ? QUICK_START : null;
      }
    });
    builder.addCase(watchGraphData.rejected, (state, { payload }) => {
      state.terraformData = '';
      state.graphData = { nodes: [], links: [] };
      state.selectedData = { nodes: [], links: [] };
      state.errorMsg = payload as string;
    });
    // fetchGraphDataByWorkspaceId: 테라폼 데이터 가져오기
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
        state.errorMsg = payload as string;
      }
    );
    // fetchGraphDataByTerraform: 가공한 그래프 데이터 가져오기 및 selected data 처리
    builder.addCase(fetchGraphDataByTerraform.pending, (state, { payload }) => {
      state.selectedNode = null;
      state.selectedModule = null;
    });
    builder.addCase(
      fetchGraphDataByTerraform.fulfilled,
      (state, { payload }) => {
        state.graphData = payload as GraphData;
        state.selectedData = payload as GraphData;
        state.errorMsg = _.isEmpty(state.graphData.nodes) ? QUICK_START : null;
      }
    );
    builder.addCase(
      fetchGraphDataByTerraform.rejected,
      (state, { payload }) => {
        state.graphData = { nodes: [], links: [] };
        state.selectedData = { nodes: [], links: [] };
        state.errorMsg = payload as string;
      }
    );
  },
});

export const {
  setTerraformDataData,
  setSelectedData,
  setSelectedNode,
  setSelectedModule,
  setFilterNodes,
} = graphSlice.actions;

export default graphSlice.reducer;
