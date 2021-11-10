import * as React from 'react';
import * as _ from 'lodash';
import {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from 'react-force-graph-2d';
import { forceManyBody, forceCollide, forceLink } from 'd3-force';
import { NodeData, LinkData } from '@renderer/types/graph';
import {
  drawNode,
  hasLink,
  hasNode,
  sethighlightElements,
} from '@renderer/utils/graph';
import { DrawingKind } from '@renderer/utils/graph/draw';
import { useAppSelector } from '@renderer/app/store';
import { selectGraphData } from '@renderer/features/graphSliceInputSelectors';

const initialConfig: GraphConfig = {
  isMounted: false,
  zoomLevel: 1,
  hoverNode: null,
  highlightNodes: [],
  highlightLinks: [],
  nodeDrawingkind: 'normal',
  linkDrawingkind: 'normal',
};

const NODE_RADIUS = 30;

export const useGraphProps = () => {
  const graphRef = React.useRef<ForceGraphMethods>();
  const graphData = useAppSelector(selectGraphData);
  const configRef = React.useRef<GraphConfig>(initialConfig);

  const nodeLabel = (obj: NodeObject) => {
    const node = obj as NodeData;
    return `<div class='tooltip-container'>
      <div class='node-type'>${node.type}</div>
      <div class='node-name'>${node.simpleName}</div>
    </div>`;
  };

  const nodeCanvasObject = (obj: NodeObject, ctx: CanvasRenderingContext2D) => {
    const node = obj as NodeData;
    const width = NODE_RADIUS * 2;
    const height = NODE_RADIUS * 2;
    let { nodeDrawingkind } = configRef.current;
    if (nodeDrawingkind !== 'normal') {
      if (!hasNode(configRef.current.highlightNodes, node)) {
        nodeDrawingkind = 'blur';
      }
      if (node === configRef.current.hoverNode) {
        nodeDrawingkind = 'focus';
      }
    }
    drawNode(ctx, node, nodeDrawingkind, width, height);
  };

  const linkVisibility = (link: LinkObject) => {
    return configRef.current.linkDrawingkind === 'normal'
      ? true
      : hasLink(configRef.current.highlightLinks, link);
  };

  const linkWidth = (link: LinkObject) => {
    return hasLink(configRef.current.highlightLinks, link) ? 5 : 1;
  };

  const handleZoomIn = () => {
    graphRef.current?.zoom(configRef.current.zoomLevel + 1, 500);
  };

  const handleZoomOut = () => {
    graphRef.current?.zoom(configRef.current.zoomLevel - 1, 500);
  };

  const handleZoomEnd = (transform: { k: number; x: number; y: number }) => {
    if (configRef.current.zoomLevel !== transform.k) {
      configRef.current.zoomLevel = transform.k;
    }
  };

  const handleZoomToFit = () => {
    graphRef.current?.zoomToFit(500);
  };

  const handleNodeHover = (
    obj: NodeObject | null,
    previousNode: NodeObject | null
  ) => {
    graphRef.current?.d3ReheatSimulation(); // redraw
    const node = obj as NodeData;
    if (node && node.id) {
      const { highlightNodes, highlightLinks } = sethighlightElements(
        graphData.nodes,
        node.id
      );
      configRef.current.hoverNode = node || null;
      configRef.current.highlightNodes = _.uniqWith(highlightNodes, _.isEqual);
      configRef.current.highlightLinks = _.uniqWith(highlightLinks, _.isEqual);
      configRef.current.nodeDrawingkind = 'highlight';
      configRef.current.linkDrawingkind = 'highlight';
    } else {
      configRef.current.hoverNode = null;
      configRef.current.highlightNodes = [];
      configRef.current.highlightLinks = [];
      configRef.current.nodeDrawingkind = 'normal';
      configRef.current.linkDrawingkind = 'normal';
    }
  };

  const handleEngineTick = () => {
    // charge: Attracts (+) or repels (-) nodes to/from each other
    const charge = forceManyBody().strength(-1);
    graphRef.current?.d3Force('charge', charge as any);
    // collide: Prevents nodes from overlapping
    const collide = forceCollide(NODE_RADIUS * 1.2);
    graphRef.current?.d3Force('collide', collide as any);
    // link: Sets link length
    const link = forceLink().distance(NODE_RADIUS);
    graphRef.current?.d3Force('link', link as any);
  };

  const handleEngineStop = () => {
    if (!configRef.current.isMounted) {
      handleZoomToFit();
      configRef.current.isMounted = true;
    }
  };

  const graphOption = {
    nodeLabel,
    nodeRelSize: NODE_RADIUS,
    nodeCanvasObject,
    linkVisibility,
    linkWidth,
    linkDirectionalArrowLength: 5,
    linkDirectionalArrowRelPos: 1,
    linkCurvature: 0.25,
    dagMode: 'td' as DagMode,
    dagLevelDistance: NODE_RADIUS * 3,
    cooldownTime: 1000,
    d3AlphaDecay: 0.5,
    enableZoomInteraction: false,
    onEngineTick: handleEngineTick,
    onEngineStop: handleEngineStop,
    onZoomEnd: handleZoomEnd,
    onNodeHover: handleNodeHover,
  };

  const graphHandler = {
    handleZoomIn,
    handleZoomOut,
    handleZoomToFit,
  };

  return { graphRef, graphOption, graphHandler };
};

type DagMode = 'td' | 'bu' | 'lr' | 'rl' | 'radialout' | 'radialin';

interface GraphConfig {
  isMounted: boolean;
  zoomLevel: number;
  hoverNode: NodeData | null;
  highlightNodes: NodeData[];
  highlightLinks: LinkData[];
  nodeDrawingkind: DrawingKind;
  linkDrawingkind: DrawingKind;
}
