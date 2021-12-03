import * as _ from 'lodash';
import { GraphData, LinkObject, NodeObject } from 'react-force-graph-2d';
import { LinkData, ModuleData, NodeData } from '@renderer/types/graph';
import { TerraformFileJsonMeta } from '@main/workspaces/common/workspace';
import { getRawGraph } from './dot';
import { getRefinedGraph, nodesById } from './parse';
import { getTerraformGraphData } from './terraform';
import {
  drawTexts,
  drawRoundRect,
  getIconColor,
  drawIcon,
  drawCircle,
  getStrokeColor,
  DrawingKind,
  getBgColor,
} from './draw';

export const QUICK_START = 'CMP Studio 시작하기';

export const getGraphData = async (
  workspaceUid: string
): Promise<GraphData> => {
  const tfGraph = await getTerraformGraphData(workspaceUid);
  // console.log('## raw dot data: ', tfGraph);
  const rawGraph = await getRawGraph(tfGraph);
  // console.log('## raw json data: ', rawGraph);
  const graph = getRefinedGraph(rawGraph);
  // console.log('## graph data: ', graph);
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
        .forEach(traverse); // 재귀 수행
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
    (node) => node.type === 'module' && node.instanceName === name
  ) as NodeData;

export const getModuleData = (nodes: NodeObject[]): ModuleData[] => {
  const data: ModuleData[] = [];
  data.push({
    root: true,
    id: 0,
    name: 'Project Root',
    path: '/',
    size: nodes.length,
  });

  const paths = new Set<string>();

  nodes.forEach((node) => {
    // 부모 노드가 없는 노드, 즉 루트 노드만 foreach 문 수행
    if (_.isEmpty((node as NodeData).parentNodes) && node.id) {
      (function traverse(n = nodesById(nodes)[node.id]) {
        const { id, instanceName, type, modules, childNodes } = n;
        if (type !== 'module') {
          return;
        }

        const path = `/${modules.join('/')}`;
        if (!paths.has(path)) {
          paths.add(path);
          const size = getPrunedGraph(nodes, id).nodes.length;
          data.push({ root: false, id, name: instanceName, path, size });
        }

        if (childNodes) {
          [...childNodes]
            .map((child: string | number) => {
              return nodesById(nodes)[child];
            })
            .forEach(traverse); // 재귀 수행
        }
      })();
    }
  });

  return data;
};

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

  const cirlceSize = 16;
  const iconColor = getIconColor(node.type, opacity);
  drawCircle(ctx, x, y - cirlceSize / 2, cirlceSize, iconColor);
  drawIcon(ctx, x - cirlceSize / 2, y - cirlceSize, cirlceSize, node.icon);

  const padding = 4;
  const newY = y + cirlceSize + padding;
  drawTexts(ctx, node.instanceName, x, newY, w - padding * 2);
};

const getCodeInfoValue = (data: any, keyName: string) => {
  for (const [key, value] of Object.entries(data)) {
    if (key === keyName) {
      return { [key]: value };
    }
  }
  return null;
};

export const getCodeInfo = (
  fileObjects: TerraformFileJsonMeta[],
  node: NodeData
) => {
  if (!Array.isArray(fileObjects)) {
    return null;
  }
  let codeInfo: any = null;
  fileObjects.forEach((file: { filePath: string; fileJson: any }) => {
    for (const currKey in file.fileJson) {
      if (node.type === currKey) {
        const data = file.fileJson[currKey];
        if (node.resourceName) {
          for (const [key] of Object.entries(data)) {
            if (key === node.resourceName) {
              codeInfo = getCodeInfoValue(data[key], node.instanceName);
            }
          }
        } else {
          codeInfo = getCodeInfoValue(data, node.instanceName);
        }
      }
    }
  });

  if (codeInfo) {
    return {
      type: node.type,
      resourceName: node.resourceName || '',
      instanceName: node.instanceName,
      content: {
        ...codeInfo,
        type: node.type,
        resouceName: node.resourceName || '',
      },
    };
  }
  return codeInfo;
};
