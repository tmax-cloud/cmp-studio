/* eslint-disable no-continue */
import * as _ from 'lodash';
import { GraphData, NodeObject } from 'react-force-graph-2d';
import { LinkData, NodeData, NodeKind } from '@renderer/types/graph';
import AWSProviderIcon from '../../../../assets/images/graph-provider-aws-icon.svg';
import DatasourceTypeIcon from '../../../../assets/images/graph-datasource-type-icon.svg';
import DefaultTypeIcon from '../../../../assets/images/graph-default-type-icon.svg';
import ModuleTypeIcon from '../../../../assets/images/graph-module-type-icon.svg';
import ResourceTypeIcon from '../../../../assets/images/graph-resource-type-icon.svg';

export const nodesById = (nodes: NodeObject[]) =>
  Object.fromEntries(nodes.map((node) => [node.id, node]));

const getIconImage = (type: NodeKind, name: string, dataSource?: boolean) => {
  switch (type) {
    case 'module':
      return ModuleTypeIcon;
    case 'provider':
      if (name === 'aws') {
        return AWSProviderIcon;
      }
      return DefaultTypeIcon;
    default:
      return dataSource ? DatasourceTypeIcon : ResourceTypeIcon;
  }
};

const parseNodeSimpleName = (str: string, status?: string) =>
  status ? str.replace(`(${status})`, '').trim() : str;

const parseNodeStatus = (str: string) => str.match(/\((.*)\)/)?.pop();

const parseNodeFullName = (str: string) => {
  let simpleName = '';
  let type = '';
  let status;
  let dataSource;
  const modules = [];

  let newStr = str;
  if (str.includes('provider[')) {
    newStr = str
      .replace('["', '.')
      .replace('"]', '')
      .replace('registry.terraform.io/hashicorp/', '')
      .replace('registry.terraform.io/', '');
  }

  const parts = newStr.split('.');
  while (parts.length > 0) {
    const part = parts.shift();
    if (!part) {
      continue;
    }

    // 데이터소스 일 경우
    if (part === 'data') {
      if (parts.length === 2) {
        dataSource = true;
      }
      continue;
    }

    const isModule = part === 'module';
    type = isModule ? 'module' : part;

    const part2 = parts.shift();
    if (part2) {
      status = parseNodeStatus(part2);
      simpleName = parseNodeSimpleName(part2, status);
      isModule && simpleName && modules.push(simpleName);
    }
  }

  const icon = getIconImage(type, simpleName, dataSource);

  return {
    simpleName,
    type,
    status,
    modules,
    icon,
    dataSource,
  };
};

const setNeighborElements = (gData: GraphData) => {
  gData.links.forEach((link) => {
    const { source, target } = link;
    const sourceNode =
      source && typeof source !== 'object' && nodesById(gData.nodes)[source];
    const targetNode =
      target && typeof target !== 'object' && nodesById(gData.nodes)[target];
    if (sourceNode && targetNode) {
      // add neighborNodes
      sourceNode.childNodes = _.union(sourceNode.childNodes, [targetNode.id]);
      targetNode.parentNodes = _.union(targetNode.parentNodes, [sourceNode.id]);
    }
  });
  return gData;
};

const removeElements = (gData: GraphData) => {
  // 그래프 유틸성 노드 및 output & variable 노드 제거
  const utilNodeList = ['root', 'meta.count-boundary (EachMode fixup)'];

  let newNodes = _.cloneDeep(gData.nodes) as NodeData[];
  let newLinks = _.cloneDeep(gData.links) as LinkData[];

  gData.nodes.forEach((n) => {
    const removeNode = n as NodeData;
    if (
      utilNodeList.includes(removeNode.fullName) ||
      removeNode.type === 'output' ||
      removeNode.type === 'var'
    ) {
      const addLinks: LinkData[] = [];
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

export const getRefinedGraph = (gData: GraphData) => {
  const nodes = gData.nodes.map((node) => {
    return { ...node, ...parseNodeFullName((node as NodeData).fullName) };
  });
  return setNeighborElements(removeElements({ nodes, links: gData.links }));
};
