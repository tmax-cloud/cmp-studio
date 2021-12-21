import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TerraformCommandResponseStatus,
  TerraformCommandResponseStatusType,
} from '@renderer/types/terraform';
import { getTerraformPlan } from '@renderer/utils/ipc/terraformIpcUtils';
import { setSidePanel, setLoadingMsg, setLoadingModal } from './uiSlice';
import { setTerraformState } from './commonSlice';

type CommandResponseDataType = {
  type: string;
  status: TerraformCommandResponseStatus;
  data: string | null;
  message: string;
};

type CommandSlice = {
  planResponseData: CommandResponseDataType;
};

const initialState: CommandSlice = {
  planResponseData: {
    type: '',
    status: 'LOADING' as TerraformCommandResponseStatusType,
    data: '',
    message: '',
  },
};

export const fetchTerraformPlanDataByWorkspaceId = createAsyncThunk(
  'command/fetchTerraformPlanDataByWorkspaceId',
  async (workspaceUid: string, { dispatch, rejectWithValue }) => {
    dispatch(setLoadingMsg('테라폼 플랜 명령어를 실행하는 중입니다.'));
    try {
      const response = await getTerraformPlan({ workspaceUid });
      dispatch(
        setTerraformState({
          status: response.status,
          message: response.data.message,
          data: response.data.planData,
        })
      );
      return response;
    } catch (error) {
      const { message } = error as any;
      dispatch(
        setTerraformState({
          status: 'Error',
          data: '',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setSidePanel(false));
      dispatch(setLoadingMsg(null));
      dispatch(setLoadingModal(false));
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
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.pending,
      (state, { payload }) => {}
    );
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.fulfilled,
      (state, { payload }) => {
        console.log('플랜 성공: ', payload);
        state.planResponseData = {
          type: payload.status.split('_')[1],
          status: payload.status.split('_')[0],
          data: payload.data.planData,
          message: payload.data.message,
        };
      }
    );
    builder.addCase(
      fetchTerraformPlanDataByWorkspaceId.rejected,
      (state, { payload }: any) => {
        state.planResponseData = {
          type: 'PLAN',
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
