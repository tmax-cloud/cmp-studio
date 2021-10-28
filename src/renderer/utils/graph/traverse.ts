import { LinkData, NodeData } from '@renderer/types/graph';

export const nodesById = (nodes: NodeData[]) =>
  Object.fromEntries(nodes.map((node) => [node.id, node]));

export const traverseGraph = (
  nodes: NodeData[],
  id: string | number | undefined,
  worker: (node: NodeData) => void
) => {
  if (!id) {
    return;
  }
  (function traverse(node = nodesById(nodes)[id]) {
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
              : nodesById(nodes)[target];
          }
        })
        .forEach(traverse);
    }
  })();
};
