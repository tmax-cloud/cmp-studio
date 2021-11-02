import * as React from 'react';
import * as _ from 'lodash';
import {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from 'react-force-graph-2d';
import { forceManyBody, forceCollide, forceLink } from 'd3-force';
import { NodeData, LinkData } from '@renderer/types/graph';
import { drawNode, hasLink, hasNode } from '@renderer/utils/graph';
import { sethighlightElements } from '@renderer/utils/graph/traverse';
import { useAppSelector } from '@renderer/app/store';
import { selectGraphData } from '@renderer/features/graphSliceInputSelectors';

const initialConfig: GraphConfig = {
  isMounted: false,
  zoomLevel: 1,
  hoverNode: null,
  nodeVisibility: true,
  linkVisibility: true,
  highlightNodes: [],
  highlightLinks: [],
};

const NODE_RADIUS = 25;

export const useGraphProps = () => {
  const graphRef = React.useRef<ForceGraphMethods>();
  const graphData = useAppSelector(selectGraphData);
  const configRef = React.useRef<GraphConfig>(initialConfig);

  const nodeCanvasObject = (obj: NodeObject, ctx: CanvasRenderingContext2D) => {
    const node = obj as NodeData;
    const x = node?.x || 0;
    const y = node?.y || 0;

    const isHightlight = configRef.current.nodeVisibility
      ? true
      : hasNode(configRef.current.highlightNodes, node as NodeData);

    drawNode(
      ctx,
      x - NODE_RADIUS,
      y - NODE_RADIUS,
      NODE_RADIUS * 2,
      NODE_RADIUS * 2,
      4,
      node,
      node === configRef.current.hoverNode,
      isHightlight
    );
  };

  const linkVisibility = (link: LinkObject) => {
    return configRef.current.linkVisibility
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
      configRef.current.nodeVisibility = false;
      configRef.current.linkVisibility = false;
      const { highlightNodes, highlightLinks } = sethighlightElements(
        graphData.nodes,
        node.id
      );
      configRef.current.hoverNode = node || null;
      configRef.current.highlightNodes = _.uniqWith(highlightNodes, _.isEqual);
      configRef.current.highlightLinks = _.uniqWith(highlightLinks, _.isEqual);
    } else {
      configRef.current.nodeVisibility = true;
      configRef.current.linkVisibility = true;
      configRef.current.hoverNode = null;
      configRef.current.highlightNodes = [];
      configRef.current.highlightLinks = [];
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
  nodeVisibility: boolean;
  linkVisibility: boolean;
  highlightNodes: NodeData[];
  highlightLinks: LinkData[];
}
