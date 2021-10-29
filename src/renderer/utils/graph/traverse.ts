import { LinkData, NodeData } from '@renderer/types/graph';

export const nodesById = (nodes: NodeData[]) =>
  Object.fromEntries(nodes.map((node) => [node.id, node]));

export const sethighlightElements = (
  nodes: NodeData[],
  id: string | number
) => {
  const highlightNodes: NodeData[] = [];
  const highlightLinks: LinkData[] = [];
  (function traverse(n = nodesById(nodes)[id]) {
    if (!n) {
      return;
    }
    highlightNodes.push(n);
    n.childNodes?.forEach((child: string | number) => {
      highlightLinks.push({ source: n.id, target: child });
    });
    if (n.childNodes) {
      [...n.childNodes]
        .map((child: string | number) => {
          return nodesById(nodes)[child];
        })
        .forEach(traverse);
    }
  })();
  return { highlightNodes, highlightLinks };
};
