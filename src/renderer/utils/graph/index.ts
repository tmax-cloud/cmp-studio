import * as _ from 'lodash';
import { GraphData, LinkObject, NodeObject } from 'react-force-graph-2d';
import { LinkData, NodeData } from '@renderer/types/graph';
import { getRawGraph } from './dot';
import { getRefinedGraph, nodesById } from './parse';
import { getTerraformGraphData } from './terraform';
import {
  drawTexts,
  drawRoundRect,
  getIconColor,
  drawImage,
  drawCircle,
  getStrokeColor,
  DrawingKind,
  getBgColor,
} from './draw';

export const QUICK_START = 'CMP Studio 시작하기';

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
  //console.log('## raw data: ', rawGraph);
  const graph = getRefinedGraph(rawGraph);
  //console.log('graph data: ', graph);
  //console.log('path: ', getModulePath(graph));
  return graph;
};

export const hasNode = (nodes: NodeObject[], node: NodeObject) => {
  return !!_.find(nodes, { id: node.id });
};

export const hasLink = (links: LinkObject[], link: LinkObject) => {
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

export const getPrunedGraph = (nodes: NodeObject[], id: string | number) => {
  const newNodes = new Set<NodeData>();
  const newLinks = new Set<LinkData>();
  (function traverse(n = nodesById(nodes)[id]) {
    if (!n) {
      return;
    }
    newNodes.add(n);
    n.childNodes?.forEach((child: string | number) => {
      newLinks.add({ source: n.id, target: child });
    });
    if (n.childNodes) {
      [...n.childNodes]
        .map((child: string | number) => {
          return nodesById(nodes)[child];
        })
        .forEach(traverse);
    }
  })();
  return {
    nodes: [...newNodes],
    links: [...newLinks],
  };
};

export const getModuleNodeByName = (
  nodes: NodeObject[],
  name: string
): NodeData | undefined =>
  (nodes as NodeData[]).find(
    (node) => node.type === 'module' && node.simpleName === name
  ) as NodeData;

export const drawNode = (
  ctx: CanvasRenderingContext2D,
  node: NodeData,
  kind: DrawingKind,
  w: number,
  h: number
) => {
  const x = node?.x || 0;
  const y = node?.y || 0;
  const lineWidth = kind === 'selected' ? 2 : 1;
  const opacity = kind === 'blur' ? 0.5 : 1;
  const bgColor = getBgColor(kind);
  const strokeColor = getStrokeColor(kind);
  const shadow = kind === 'hover';

  drawRoundRect(
    ctx,
    x - w / 2,
    y - h / 2,
    w,
    h,
    lineWidth,
    strokeColor,
    bgColor,
    opacity,
    shadow
  );

  const cirlceSize = 12;
  const iconColor = getIconColor(opacity, node.type, node.isDataSource);
  drawCircle(ctx, x, y - cirlceSize / 2, cirlceSize, iconColor);
  drawImage(ctx, node.icon, x - cirlceSize / 2, y - cirlceSize, cirlceSize);

  const padding = 4;
  drawTexts(ctx, node.simpleName, x, y + cirlceSize + padding, w - padding * 2);
};
