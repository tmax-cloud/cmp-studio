import { useMemo } from 'react';
import * as _ from 'lodash';
import { GraphData } from 'react-force-graph-2d';

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
