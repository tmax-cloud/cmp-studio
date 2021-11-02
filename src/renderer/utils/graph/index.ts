import * as _ from 'lodash';
import { GraphData } from 'react-force-graph-2d';
import { LinkData, NodeData } from '@renderer/types/graph';
import { getRawGraph } from './dot';
import { getRefinedGraph } from './parse';
import { getTerraformGraphData } from './terraform';
import { draw2Texts, drawRoundRect, getBgColor } from './draw';

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

export const hasNode = (nodes: NodeData[], node: NodeData) => {
  return !!_.find(nodes, { id: node.id });
};

export const hasLink = (links: LinkData[], link: LinkData) => {
  const source =
    typeof link === 'object'
      ? (link.source as NodeData).id
      : (link as LinkData).source;
  const target =
    typeof link === 'object'
      ? (link.target as NodeData).id
      : (link as LinkData).target;
  return !!_.find(links, { source, target });
};

export const drawNode = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  node: NodeData,
  isHover: boolean,
  isHightlight: boolean
) => {
  const lineWidth = isHover ? 4 : 2;
  const opacity = isHightlight ? 1 : 0.5;
  const bgColor = getBgColor(node.type, opacity);
  const strokeColor = isHover ? 'red' : bgColor;

  // outter rect
  drawRoundRect(
    ctx,
    x,
    y,
    w,
    h,
    radius,
    lineWidth,
    strokeColor,
    bgColor,
    opacity
  );

  const imageSize = 24;
  const img = document.createElement('img');
  img.src = node.icon;
  ctx.drawImage(img, x + 1 + imageSize / 2, y + 2, imageSize, imageSize);

  // inner rect
  drawRoundRect(
    ctx,
    x + 1,
    y + 29,
    w - 2,
    20,
    radius,
    lineWidth,
    bgColor,
    'white',
    opacity
  );

  draw2Texts(ctx, x, y, w, h, node.type, node.simpleName);
};
