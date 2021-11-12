import * as _ from 'lodash';
import { GraphData } from 'react-force-graph-2d';
import { LinkData, NodeData, NodeKind } from '@renderer/types/graph';
import DefaultTypeIcon from '../../../../assets/images/graph-default-type-icon.svg';
import ModuleTypeIcon from '../../../../assets/images/graph-module-type-icon.svg';
import ResourceTypeIcon from '../../../../assets/images/graph-resource-type-icon.svg';

export const nodesById = (nodes: NodeData[]) =>
  Object.fromEntries(nodes.map((node) => [node.id, node]));

const getIconImage = (type: NodeKind, name: string) => {
  switch (type) {
    case 'module':
      return ModuleTypeIcon;
    case 'provider':
      return DefaultTypeIcon;
    default:
      return ResourceTypeIcon;
  }
};

const parseNodeSimpleName = (str: string, status?: string) =>
  status ? str.replace(`(${status})`, '').trim() : str;

const parseNodeStatus = (str: string) => str.match(/\((.*)\)/)?.pop();

const parseNodeProviderName = (str: string) =>
  str
    .match(/\[(.*)\]/)
    ?.pop()
    ?.replace(/"/g, '')
    .replace('registry.terraform.io/hashicorp/', '');

const parseNodeFullName = (str: string) => {
  let simpleName = '';
  let type = '';
  let status: string | undefined;
  const modules: NodeKind[] = [];

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

  const icon = getIconImage(type, simpleName);

  return {
    simpleName,
    type,
    status,
    modules,
    icon,
  };
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

const removeUtilElements = (gData: GraphData) => {
  const utilNodeList = ['root', 'meta.count-boundary (EachMode fixup)'];
  let newNodes = _.cloneDeep(gData.nodes) as NodeData[];
  let newLinks = _.cloneDeep(gData.links) as LinkData[];
  const addLinks: LinkData[] = [];
  utilNodeList.forEach((fullName) => {
    const removeNode = newNodes.find(
      (node) => (node as NodeData).fullName === fullName
    ) as NodeData;
    if (removeNode) {
      newLinks.forEach((link) => {
        // connecting with a new node
        if (link.source === removeNode.id) {
          newLinks.forEach((link2) => {
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

const removeVarElements = (gData: GraphData) => {
  let newNodes = _.cloneDeep(gData.nodes) as NodeData[];
  const newLinks: LinkData[] = [];

  gData.links.forEach((link) => {
    const { source, target } = link;
    const sourceNode =
      source && typeof source !== 'object' && nodesById(newNodes)[source];
    const targetNode =
      target && typeof target !== 'object' && nodesById(newNodes)[target];
    if (
      sourceNode.type !== 'output' &&
      sourceNode.type !== 'var' &&
      targetNode.type !== 'output' &&
      targetNode.type !== 'var'
    ) {
      newLinks.push(link);
    }
  });

  newNodes = newNodes.filter(
    (node) => node.type !== 'output' && node.type !== 'var'
  );

  return { nodes: newNodes, links: newLinks };
};

const removeElements = (gData: GraphData) => {
  return removeVarElements(removeUtilElements(gData));
};

export const getRefinedGraph = (gData: GraphData) => {
  const nodes = gData.nodes.map((node) => {
    return { ...node, ...parseNodeFullName((node as NodeData).fullName) };
  });
  return setNeighborElements(removeElements({ nodes, links: gData.links }));
};
