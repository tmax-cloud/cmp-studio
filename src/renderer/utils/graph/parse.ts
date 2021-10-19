import { GraphData } from 'react-force-graph-2d';
import { LinkData, NodeData, NodeKind, ROOT } from '../../types/graph';
import { nodesById } from './traverse';

const parseNodeSimpleName = (str: string, status?: string) =>
  status ? str.replace(`(${status})`, '').trim() : str;

const parseNodeStatus = (str: string) => str.match(/\((.*)\)/)?.pop();

const parseNodeProviderName = (str: string) =>
  str
    .match(/\[(.*)\]/)
    ?.pop()
    ?.replace(/"/g, '');

const parseNodeFullName = (str: string) => {
  let simpleName: string | undefined;
  let type: string | undefined;
  let status: string | undefined;
  const modules: NodeKind[] = [ROOT];

  if (str === ROOT) {
    return { simpleName: ROOT, modules };
  }

  const isProvider = str.startsWith('provider[');
  if (isProvider) {
    type = 'provider';
    status = parseNodeStatus(str);
    simpleName = parseNodeSimpleName(str, status);
    const providerName = parseNodeProviderName(simpleName);
    simpleName = providerName || simpleName;
  } else {
    const parts = str.split('.');
    while (parts.length > 0) {
      const part = parts.shift();
      if (part) {
        const isModule = part === 'module';
        type = isModule ? 'module' : part;
        const part2 = parts.shift();
        if (part2) {
          status = parseNodeStatus(part2);
          simpleName = parseNodeSimpleName(part2, status);
          isModule && simpleName && modules.push(simpleName);
        }
      }
    }
  }

  return { simpleName, type, status, modules };
};

const setNeighborElements = (gData: GraphData) => {
  gData.links.forEach((link) => {
    const { source, target } = link;
    const sourceNode =
      source && typeof source !== 'object' && nodesById(gData)[source];
    const targetNode =
      target && typeof target !== 'object' && nodesById(gData)[target];
    if (sourceNode && targetNode) {
      // add neighborNodes
      !sourceNode.childNodes && (sourceNode.childNodes = new Set<NodeData>());
      !targetNode.parentNodes && (targetNode.parentNodes = new Set<NodeData>());
      sourceNode.childNodes.add(targetNode);
      targetNode.parentNodes.add(sourceNode);
      // add neighborLinks
      !sourceNode.childLinks && (sourceNode.childLinks = new Set<LinkData>());
      !targetNode.parentLinks && (targetNode.parentLinks = new Set<LinkData>());
      sourceNode.childLinks.add(link);
      targetNode.parentLinks.add(link);
    }
  });
  return gData;
};

export const getRefinedGraph = (gData: GraphData) => {
  const nodes = gData.nodes.map((node) => {
    return { ...node, ...parseNodeFullName((node as NodeData).fullName) };
  });
  return setNeighborElements({ nodes, links: gData.links });
};
