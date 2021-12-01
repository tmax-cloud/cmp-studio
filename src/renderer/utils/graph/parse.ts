/* eslint-disable no-continue */
import * as _ from 'lodash';
import { GraphData, NodeObject } from 'react-force-graph-2d';
import { LinkData, NodeData } from '@renderer/types/graph';
import { getIconInfo } from '@renderer/components/topology/icon/IconFactory';
import { isTerraformType } from '@renderer/types/terraform';

export const nodesById = (nodes: NodeObject[]) =>
  Object.fromEntries(nodes.map((node) => [node.id, node]));

const parseNodeInstanceName = (str: string, state?: string) =>
  state ? str.replace(`(${state})`, '').trim() : str;

const parseNodeState = (str: string) => str.match(/\((.*)\)/)?.pop();

const parseNodeFullName = (str: string) => {
  let type = '';
  let resourceName;
  let instanceName = '';
  let state;
  const modules = [];
  let isData = false;

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

    // 데이터소스일 경우
    if (part === 'data' && parts.length === 2) {
      isData = true;
      continue;
    }

    // set type
    type = part;
    if (!isTerraformType(part)) {
      if (part === 'var') {
        type = 'variable';
      } else {
        resourceName = part;
        type = 'resource';
      }
    }
    if (isData) {
      type = 'data';
      isData = false;
    }

    // set instance name
    const part2 = parts.shift();
    if (part2) {
      state = parseNodeState(part2);
      instanceName = parseNodeInstanceName(part2, state);
      part === 'module' && instanceName && modules.push(instanceName);
    }
  }

  const icon = getIconInfo(resourceName || instanceName);

  return {
    type,
    instanceName,
    resourceName,
    state,
    modules,
    icon,
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

const removeNodeList = (node: NodeData) => {
  // 유틸성 노드 제거
  const fullNames = ['root', 'meta.count-boundary (EachMode fixup)'];
  // output & variable 노드 제거
  const types = ['output', 'variable'];
  // close 상태인 노드 제거
  const states = ['close'];
  return (
    fullNames.includes(node.fullName) ||
    types.includes(node.type) ||
    states.includes(node.state || '')
  );
};

const removeElements = (gData: GraphData) => {
  let newNodes = _.cloneDeep(gData.nodes) as NodeData[];
  let newLinks = _.cloneDeep(gData.links) as LinkData[];

  gData.nodes.forEach((n) => {
    const removeNode = n as NodeData;
    if (removeNodeList(removeNode)) {
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
