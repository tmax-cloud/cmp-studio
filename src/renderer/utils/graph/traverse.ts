import { GraphData } from 'react-force-graph-2d';
import { LinkData, NodeData } from '../../types/graph';

export const nodesById = (gData: GraphData) =>
  Object.fromEntries(gData.nodes.map((node) => [node.id, node]));

export const traverseGraph = (
  gData: GraphData,
  id: string | number,
  worker: (node: NodeData) => void
) => {
  (function traverse(node = nodesById(gData)[id]) {
    if (!node) {
      return;
    }
    worker(node); // do something
    if (node.childLinks) {
      [...node.childLinks]
        .map((link: LinkData) => {
          const { target } = link;
          if (target) {
            return typeof target === 'object'
              ? target
              : nodesById(gData)[target];
          }
        })
        .forEach(traverse);
    }
  })();
};
