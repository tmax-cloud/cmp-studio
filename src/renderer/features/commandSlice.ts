import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TerraformCommandResponseStatus,
  TerraformCommandResponseStatusType,
} from '@renderer/types/terraform';
import {
  getTerraformPlan,
  getTerraformApply,
} from '@renderer/utils/ipc/terraformIpcUtils';
import {
  setSidePanel,
  setLoadingMsg,
  setLoadingModal,
  setCommandPage,
} from './uiSlice';

type CommandResponseDataType = {
  type: string;
  status: TerraformCommandResponseStatus;
  data: string | null;
  message: string;
};

type CommandSlice = {
  terraformResponseData: CommandResponseDataType;
};

const initialState: CommandSlice = {
  terraformResponseData: {
    type: '',
    status: 'INIT' as TerraformCommandResponseStatusType,
    data: '',
    message: '',
  },
};

export const fetchTerraformApplyDataByWorkspaceId = createAsyncThunk(
  'command/fetchTerraformApplyDataByWorkspaceId',
  async (workspaceUid: string, { dispatch, rejectWithValue }) => {
    dispatch(setLoadingMsg('테라폼 어플라이 명령어를 실행하는 중입니다.'));
    try {
      const response = await getTerraformApply({ workspaceUid });
      return response;
    } catch (error) {
      const { message } = error as any;
      return rejectWithValue(message);
    } finally {
      dispatch(setSidePanel(false));
      dispatch(setLoadingMsg(null));
      dispatch(setLoadingModal(false));
      dispatch(setCommandPage(true));
    }
  }
);

export const fetchTerraformPlanDataByWorkspaceId = createAsyncThunk(
  'command/fetchTerraformPlanDataByWorkspaceId',
  async (workspaceUid: string, { dispatch, rejectWithValue }) => {
    dispatch(setLoadingMsg('테라폼 플랜 명령어를 실행하는 중입니다.'));
    try {
      const response = await getTerraformPlan({ workspaceUid });
      return response;
    } catch (error) {
      const { message } = error as any;
      return rejectWithValue(message);
    } finally {
      dispatch(setSidePanel(false));
      dispatch(setLoadingMsg(null));
      dispatch(setLoadingModal(false));
      dispatch(setCommandPage(true));
    }
  }
);

const commandSlice = createSlice({
  name: 'command',
  initialState,
  reducers: {
    setTerraformCommandResponse: (state, action: PayloadAction<any>) => {
      state.terraformResponseData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.pending,
      (state, { payload }) => {}
    );
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.fulfilled,
      (state, { payload }) => {
        state.terraformResponseData = {
          type: 'PLAN',
          status: payload.status,
          data: payload.data.planData,
          message: payload.data.message,
        };
      }
    );
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.rejected,
      (state, { payload }: any) => {
        state.terraformResponseData = {
          type: 'PLAN',
          status: TerraformCommandResponseStatusType.ERROR,
          data: null,
          message: payload.data.message,
        };
      }
    );
    builder.addCase(
      fetchTerraformApplyDataByWorkspaceId.pending,
      (state, { payload }) => {}
    );
    builder.addCase(
      fetchTerraformApplyDataByWorkspaceId.fulfilled,
      (state, { payload }) => {
        state.terraformResponseData = {
          type: 'APPLY',
          status: payload.status,
          data: payload.data.applyData,
          message: payload.data.message,
        };
      }
    );
    builder.addCase(
      fetchTerraformApplyDataByWorkspaceId.rejected,
      (state, { payload }: any) => {
        state.terraformResponseData = {
          type: 'APPLY',
          status: TerraformCommandResponseStatusType.ERROR,
          data: null,
          message: payload.data.message,
        };
      }
    );
  },
});

export const { setTerraformCommandResponse } = commandSlice.actions;

export default commandSlice.reducer;
