import { IPCResponse } from '../../base/common/ipc';

export type TerraformInitArgs = {
  workspaceUid: string;
};

export type TerraformGraphArgs = {
  workspaceUid: string;
};

export enum TerraformStatusType {
  SUCCESS = 'SUCCESS',
  ERROR_INIT = 'ERROR_INIT',
  ERROR_GRAPH = 'ERROR_GRAPH',
  ERROR_TF_EXE_PATH = 'ERROR_TF_EXE_PATH',
}

type TerraformStatus =
  | TerraformStatusType.SUCCESS
  | TerraformStatusType.ERROR_INIT
  | TerraformStatusType.ERROR_GRAPH
  | TerraformStatusType.ERROR_TF_EXE_PATH;

export type TerraformGraphSuccessData = { graphData: string };
export type TerraformErrorData = { message: string };

type TerraformData = TerraformGraphSuccessData | TerraformErrorData;

export type TerraformResponse = IPCResponse<TerraformStatus, TerraformData>;
