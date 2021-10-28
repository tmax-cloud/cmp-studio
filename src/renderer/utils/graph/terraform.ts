import {
  doTerraformInit,
  getTerraformGraph,
} from '@renderer/utils/ipc/terraformIpcUtils';
import {
  TerraformErrorData,
  TerraformGraphSuccessData,
  TerraformStatusType,
} from '@main/terraform-command/common/terraform';

export const INIT_FINISHED = '테라폼 초기화가 완료되었습니다.';

export const getTerraformGraphData = async (workspaceUid: string) => {
  let graphData;
  const response = await getTerraformGraph({ workspaceUid });
  if (response.status === TerraformStatusType.ERROR_GRAPH) {
    const response2 = await doTerraformInit({ workspaceUid });
    if (response2.status === TerraformStatusType.ERROR_INIT) {
      const { message } = response2.data as TerraformErrorData;
      throw new Error(`테라폼 초기화에 실패했습니다.\n\n${message}`);
    } else if (response2.status === TerraformStatusType.SUCCESS) {
      const response3 = await getTerraformGraph({ workspaceUid });
      if (response3.status === TerraformStatusType.ERROR_GRAPH) {
        const { message } = response3.data as TerraformErrorData;
        throw new Error(
          `테라폼 그래프 명령어 실행에 문제가 있습니다.\n\n${message}`
        );
      } else if (response3.status === TerraformStatusType.SUCCESS) {
        graphData = (response3.data as TerraformGraphSuccessData).graphData;
      }
    }
  } else if (response.status === TerraformStatusType.SUCCESS) {
    graphData = (response.data as TerraformGraphSuccessData).graphData;
  }
  if (!graphData) {
    throw new Error('테라폼 그래프 명령어 실행 오류');
  }
  return graphData;
};
