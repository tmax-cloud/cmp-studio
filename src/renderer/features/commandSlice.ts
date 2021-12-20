import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TerraformCommandResponseStatus,
  TerraformCommandResponseStatusType,
} from '@renderer/types/terraform';
import * as TerraformTypes from '@main/terraform-command/common/terraform';
import { getTerraformPlan } from '@renderer/utils/ipc/terraformIpcUtils';

type CommandResponseDataType = {
  status: TerraformCommandResponseStatus;
  data: string;
  message: string;
};

type CommandSlice = {
  planResponseData: CommandResponseDataType;
  loadingMsg: string | null;
  errorMsg: string | null;
  planData: string;
};

const initialState: CommandSlice = {
  planResponseData: {
    status: 'LOADING' as TerraformCommandResponseStatusType,
    data: '',
    message: '',
  },
  loadingMsg: '',
  errorMsg: '',
  planData: '',
};

export const fetchTerraformPlanDataByWorkspaceId = createAsyncThunk(
  'command/fetchTerraformPlanDataByWorkspaceId',
  async (
    workspaceUid: TerraformTypes.TerraformPlanArgs,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const data = await getTerraformPlan(workspaceUid);
      return data;
    } catch (error) {
      const { message } = error;
      return rejectWithValue(message);
    }
  }
);

const commandSlice = createSlice({
  name: 'command',
  initialState,
  reducers: {
    setTerraformCommandResponse: (state, action: PayloadAction<any>) => {
      state.planResponseData = action.payload;
    },
    setTerraformPlanErrorMsg: (state, action: PayloadAction<any>) => {
      state.errorMsg = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.pending,
      (state, { payload }) => {
        state.loadingMsg = '테라폼 플랜 명령어를 실행하는 중입니다.';
      }
    );
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.fulfilled,
      (state, { payload }) => {
        state.planData = payload as string;
        state.loadingMsg = null;
        state.errorMsg = null;
      }
    );
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.rejected,
      (state, { payload }) => {
        state.planData = '';
        state.loadingMsg = null;
        state.errorMsg = payload as string;
      }
    );
  },
});

export const { setTerraformCommandResponse, setTerraformPlanErrorMsg } =
  commandSlice.actions;

export default commandSlice.reducer;
