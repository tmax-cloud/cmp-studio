import { IPCResponse } from '../../base/common/ipc';

export type TerraformInitArgs = {
  workspaceUid: string;
};

export type TerraformGraphArgs = {
  workspaceUid: string;
};
export type TerraformPlanArgs = {
  workspaceUid: string;
};

export type TerraformVersionArgs = {
  workspaceUid: string;
};

export type TerraformCheckExeArgs = {
  terraformExePath: string;
};

export enum TerraformStatusType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  ERROR_INIT = 'ERROR_INIT',
  ERROR_GRAPH = 'ERROR_GRAPH',
  ERROR_PLAN = 'ERROR_PLAN',
  ERROR_TF_EXE_PATH = 'ERROR_TF_EXE_PATH',
}

type TerraformStatus =
  | TerraformStatusType.SUCCESS
  | TerraformStatusType.ERROR
  | TerraformStatusType.ERROR_INIT
  | TerraformStatusType.ERROR_GRAPH
  | TerraformStatusType.ERROR_PLAN
  | TerraformStatusType.ERROR_TF_EXE_PATH;

export type TerraformPlanSuccessData = { planData: string };
export type TerraformVersionSuccessData = { versionData: string };
export type TerraformGraphSuccessData = { graphData: string };
export type TerraformErrorData = { message: string };

type TerraformData =
  | TerraformGraphSuccessData
  | TerraformErrorData
  | TerraformVersionSuccessData
  | TerraformPlanSuccessData
  | string;

export type TerraformResponse = IPCResponse<TerraformStatus, TerraformData>;
