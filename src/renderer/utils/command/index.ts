import * as _ from 'lodash-es';
import { TerraformStatusType } from '@main/terraform-command/common/terraform';
import { getTerraformPlan } from '../ipc/terraformIpcUtils';

export const getTerraformPlanData = async (workspaceUid: string) => {
  let terraformPlanData;
  const response = await getTerraformPlan({ workspaceUid });
  if (response.status === TerraformStatusType.SUCCESS) {
    terraformPlanData = response.data as any;
  } else if (response.status === TerraformStatusType.ERROR_PLAN) {
    const { message } = response.data as any;
    throw new Error(`테라폼 플랜 명령어 실행에 문제가 있습니다.\n\n${message}`);
  }
  return terraformPlanData;
};
