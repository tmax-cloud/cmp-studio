import * as React from 'react';
import { GraphData } from 'react-force-graph-2d';
import { getGraphData } from '@renderer/utils/graph';
import {
  doTerraformInit,
  getTerraformGraph,
} from '@renderer/utils/ipc/terraformIpcUtils';
import {
  TerraformErrorData,
  TerraformGraphSuccessData,
  TerraformStatusType,
} from '@main/terraform-command/common/terraform';

export const useGraphData = (workspaceUid: string) => {
  const [data, setData] = React.useState<GraphData>({ nodes: [], links: [] });
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:terraformInitStdout',
      (res: string) => {
        // TODO : string에 포함된 색표시 태그들 어떻게 처리 할 것인지 정하기
        const prettyRes = res
          .replaceAll('[0m', '')
          .replaceAll('[1m', '')
          .replaceAll('[32m', '');
        setError(prettyRes);
      }
    );
  }, []);

  React.useEffect(() => {
    const getTerraformGraphData = async () => {
      let graphData;
      const response = await getTerraformGraph({ workspaceUid });
      if (response.status === TerraformStatusType.ERROR_GRAPH) {
        setError('terraform graph 커맨드에 에러가 있어 init 시도중입니다...');
        const response2 = await doTerraformInit({ workspaceUid });
        if (response2.status === TerraformStatusType.ERROR_INIT) {
          throw new Error(
            'terraform init에 실패했습니다. 에러 내용 : ' +
              (response2.data as TerraformErrorData).message
          );
        } else if (response2.status === TerraformStatusType.SUCCESS) {
          setError('init 성공 후 다시 graph 가져오는중...');
          const response3 = await getTerraformGraph({ workspaceUid });
          if (response3.status === TerraformStatusType.ERROR_GRAPH) {
            throw new Error(
              'terraform graph 커맨드 실행에 문제가 있습니다. ' +
                (response3.data as TerraformErrorData).message
            );
          } else if (response3.status === TerraformStatusType.SUCCESS) {
            graphData = (response3.data as TerraformGraphSuccessData).graphData;
          }
        }
      } else if (response.status === TerraformStatusType.SUCCESS) {
        graphData = (response.data as TerraformGraphSuccessData).graphData;
      }
      if (!graphData) {
        throw new Error('terraform graph 커맨드 실행 오류');
      }
      setError(undefined);
      return graphData;
    };

    const fetchData = async () => {
      try {
        const tgd = await getTerraformGraphData();
        const gd = await getGraphData(tgd);
        setData(gd);
      } catch (err) {
        const { message } = err as Error;
        setError(message);
      }
    };
    fetchData();
  }, [workspaceUid]);

  return { data, error };
};
