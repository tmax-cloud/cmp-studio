import * as _ from 'lodash';
import { GraphData } from 'react-force-graph-2d';
import { NodeData } from '@renderer/types/graph';
import { getRawGraph } from './dot';
import { getRefinedGraph } from './parse';
import { getTerraformGraphData } from './terraform';

export const getModuleNodeByName = (
  gData: GraphData,
  name: string
): NodeData | undefined =>
  gData.nodes.find(
    (node) =>
      (node as NodeData).type === 'module' &&
      (node as NodeData).simpleName === name
  ) as NodeData;

/*export const getPrunedGraph = (
  gData: GraphData,
  id: number | string
): GraphData => {
  const visibleNodes = new Set<NodeData>();
  const visibleLinks = new Set<LinkData>();
  traverseGraph(gData.nodes, id, (node) => {
    visibleNodes.add(node);
    if (!node.childLinks) {
      return;
    }
    node.childLinks.forEach((childLink: LinkData) => {
      visibleLinks.add(childLink);
    });
  });
  return { nodes: [...visibleNodes], links: [...visibleLinks] };
};*/

/*export const getModulePath = (gData: GraphData): ModulePath[] => {
  const modulePaths: ModulePath[] = [];
  const paths = new Set<string>();
  const rootId = getRootNode(gData)?.id;

  if (!rootId) {
    return modulePaths;
  }

  traverseGraph(gData, rootId, (node) => {
    const { modules } = node;
    if (!modules) {
      return;
    }
    const modulePath = modules.join('/');
    const isDuplicate = [...paths].some((path) => _.isEqual(path, modulePath));
    if (isDuplicate) {
      return;
    }
    paths.add(modulePath);
    const name = modules.pop();
    const path =
      name === ROOT
        ? modulePath.replace('root', '/')
        : modulePath.replace('root', '');
    if (name) {
      modulePaths.push({ name, path });
    }
  });

  [...modulePaths].forEach((module) => {
    if (module.name === ROOT) {
      module.id = getRootNode(gData)?.id;
    } else {
      module.id = getModuleNodeByName(gData, module.name)?.id;
    }
    if (module.id) {
      module.size = getPrunedGraph(gData, module.id).nodes.length;
    }
  });

  return modulePaths;
};*/

export const getGraphData = async (
  workspaceUid: string
): Promise<GraphData> => {
  const tfGraph = await getTerraformGraphData(workspaceUid);
  const rawGraph = await getRawGraph(tfGraph);
  const graph = getRefinedGraph(rawGraph);
  console.log('graph data: ', graph);
  //console.log('path: ', getModulePath(graph));
  return graph;
};
