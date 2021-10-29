import * as _ from 'lodash';
import { GraphData } from 'react-force-graph-2d';
import { LinkData, NodeData, NodeKind, ROOT } from '@renderer/types/graph';
import { nodesById } from './traverse';

export const getRootNode = (nodes: NodeData[]): NodeData | undefined =>
  nodes.find((node) => (node as NodeData).simpleName === ROOT) as NodeData;

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
  const nodes = gData.nodes as NodeData[];
  gData.links.forEach((link) => {
    const { source, target } = link;
    const sourceNode =
      source && typeof source !== 'object' && nodesById(nodes)[source];
    const targetNode =
      target && typeof target !== 'object' && nodesById(nodes)[target];
    if (sourceNode && targetNode) {
      // add neighborNodes
      sourceNode.childNodes = _.union(sourceNode.childNodes, [targetNode.id]);
      targetNode.parentNodes = _.union(targetNode.parentNodes, [sourceNode.id]);
    }
  });
  return gData;
};

const filterElements = (gData: GraphData) => {
  const removeNodeList = ['meta.count-boundary (EachMode fixup)'];
  let newNodes = _.cloneDeep(gData.nodes) as NodeData[];
  let newLinks = _.cloneDeep(gData.links) as LinkData[];
  const addLinks: LinkData[] = [];
  removeNodeList.forEach((fullName) => {
    const removeNode = gData.nodes.find(
      (node) => (node as NodeData).fullName === fullName
    ) as NodeData;
    if (removeNode) {
      gData.links.forEach((link) => {
        // connecting with a new node
        if (link.source === removeNode.id) {
          gData.links.forEach((link2) => {
            if (link2.target === removeNode.id) {
              addLinks.push({ source: link2.source, target: link.target });
            }
          });
        }
      });
      // remove node
      newNodes = newNodes.filter((node) => node.id !== removeNode.id);
      newLinks = newLinks.filter(
        (link) => link.source !== removeNode.id && link.target !== removeNode.id
      );
      newLinks = _.union(newLinks, addLinks);
    }
  });
  return { nodes: newNodes, links: newLinks };
};

export const getRefinedGraph = (gData: GraphData) => {
  const nodes = gData.nodes.map((node) => {
    return { ...node, ...parseNodeFullName((node as NodeData).fullName) };
  });
  return setNeighborElements(filterElements({ nodes, links: gData.links }));
};
