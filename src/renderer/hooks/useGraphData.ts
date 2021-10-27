import { useEffect, useMemo, useState } from 'react';
import * as _ from 'lodash';
import { GraphData } from 'react-force-graph-2d';
import { INIT_FINISHED } from '@renderer/utils/graph/terraform';

export const useGraphData = (originalGraphData: GraphData) => {
  const { nodes, links } = originalGraphData;
  return useMemo(
    () => ({
      nodes: _.cloneDeep(nodes),
      links: _.cloneDeep(links),
    }),
    [nodes, links]
  );
};

export const useGraphInitOutput = () => {
  const [output, setOutput] = useState<string>();
  const succeessMsg = 'Terraform has been successfully initialized!';
  useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:terraformInitStdout',
      (res: string) => {
        if (!res.includes('Warning')) {
          res.includes(succeessMsg) ? setOutput(INIT_FINISHED) : setOutput(res);
        }
      }
    );
  }, []);
  return output;
};
