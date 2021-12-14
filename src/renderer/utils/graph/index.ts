import * as _ from 'lodash';
import { GraphData, LinkObject, NodeObject } from 'react-force-graph-2d';
import { LinkData, ModuleData, NodeData } from '@renderer/types/graph';
import { TerraformFileJsonMeta } from '@main/workspaces/common/workspace';
import {
  TerraformErrorData,
  TerraformGraphSuccessData,
  TerraformStatusType,
} from '@main/terraform-command/common/terraform';
import { doTerraformInit, getTerraformGraph } from '../ipc/terraformIpcUtils';
import { getRawGraph } from './dot';
import { getRefinedGraph, nodesById } from './parse';
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
export const INIT_FINISHED = '테라폼 초기화가 완료되었습니다.';

export const getTerraformData = async (workspaceUid: string) => {
  let graphData;
  const response = await getTerraformGraph({ workspaceUid });
  if (response.status === TerraformStatusType.ERROR_GRAPH) {
    const response2 = await doTerraformInit({ workspaceUid });
    if (response2.status === TerraformStatusType.ERROR_INIT) {
      const { message } = response2.data as TerraformErrorData;
      throw new Error(`테라폼 초기화에 실패했습니다.\n\n${message}`);
    } else if (response2.status === TerraformStatusType.SUCCESS) {
      const response3 = await getTerraformGraph({ workspaceUid });
      if (response3.status === TerraformStatusType.ERROR_GRAPH) {
        const { message } = response3.data as TerraformErrorData;
        throw new Error(
          `테라폼 그래프 명령어 실행에 문제가 있습니다.\n\n${message}`
        );
      } else if (response3.status === TerraformStatusType.SUCCESS) {
        graphData = (response3.data as TerraformGraphSuccessData).graphData;
      }
    }
  } else if (response.status === TerraformStatusType.SUCCESS) {
    graphData = (response.data as TerraformGraphSuccessData).graphData;
  }
  if (!graphData) {
    throw new Error('테라폼 그래프 명령어 실행 오류');
  }
  // console.log('## terraform dot data: ', graphData);
  return graphData;
};

export const getGraphData = async (
  terraformData: string
): Promise<GraphData> => {
  const rawGraph = await getRawGraph(terraformData);
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
  let codeValue = null;
  for (const [key, value] of Object.entries(data)) {
    if (key === keyName) {
      codeValue = value;
    }
  }
  return codeValue;
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
          const resourceData = getCodeInfoValue(data, node.resourceName);
          if (resourceData) {
            const content = getCodeInfoValue(resourceData, node.instanceName);
            if (content) {
              codeInfo = content;
            }
          }
        } else {
          const content = getCodeInfoValue(data, node.instanceName);
          if (content) {
            codeInfo = content;
          }
        }
      }
    }
  });
  if (codeInfo) {
    return {
      type: node.type,
      resourceName: node.resourceName || '',
      instanceName: node.instanceName,
      content: codeInfo,
    };
  }
};
