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
  getPrunedGraph,
} from '@renderer/utils/graph';
import { DrawingKind } from '@renderer/utils/graph/draw';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import {
  selectSelectedData,
  selectSelectedModule,
  selectSelectedNode,
} from '@renderer/features/graphSliceInputSelectors';
import {
  setSelectedData,
  setSelectedModule,
  setSelectedNode,
} from '@renderer/features/graphSlice';

const initialConfig: GraphConfig = {
  isMounted: false,
  zoomLevel: 1,
  dragNode: null,
  hoverNode: null,
  highlightNodes: [],
  highlightLinks: [],
  clickCount: 0,
};

const NODE_RADIUS = 30;

export const useGraphProps = () => {
  const graphRef = React.useRef<ForceGraphMethods>();
  const configRef = React.useRef<GraphConfig>(initialConfig);

  const graphData = useAppSelector(selectSelectedData);
  const selectedNode = useAppSelector(selectSelectedNode);
  const selectedModule = useAppSelector(selectSelectedModule);

  const dispatch = useAppDispatch();

  const nodeLabel = (obj: NodeObject) => {
    const node = obj as NodeData;
    return `<div class='tooltip-container'>
      <div class='node-type'>${node.resourceName || node.type}</div>
      <div class='node-name'>${node.instanceName}</div>
    </div>`;
  };

  const nodeCanvasObject = (obj: NodeObject, ctx: CanvasRenderingContext2D) => {
    const node = obj as NodeData;
    const width = NODE_RADIUS * 2;
    const height = NODE_RADIUS * 2;
    const { dragNode, hoverNode, highlightNodes } = configRef.current;
    let drawingKind: DrawingKind = 'normal';
    if (hoverNode) {
      drawingKind = hasNode(highlightNodes, node) ? 'hover' : 'blur';
    }
    if (node.id === selectedNode?.id) {
      drawingKind = 'selected';
    }
    if (node === dragNode) {
      drawingKind = 'drag';
    }
    drawNode(ctx, node, drawingKind, width, height);
  };

  const linkVisibility = (link: LinkObject) => {
    if (!configRef.current.hoverNode) {
      return true;
    }
    return hasLink(configRef.current.highlightLinks, link);
  };

  const linkWidth = (link: LinkObject) => {
    return hasLink(configRef.current.highlightLinks, link) ? 5 : 1;
  };

  const linkColor = (link: LinkObject) => {
    return '#d3d3d3';
  };

  const linkDirectionalArrowColor = (link: LinkObject) => {
    return '#bababa';
  };

  const handleZoomIn = () => {
    graphRef.current?.zoom(configRef.current.zoomLevel + 0.1, 500);
  };

  const handleZoomOut = () => {
    graphRef.current?.zoom(configRef.current.zoomLevel - 0.1, 500);
  };

  const handleZoomEnd = (transform: { k: number; x: number; y: number }) => {
    if (configRef.current.zoomLevel !== transform.k) {
      configRef.current.zoomLevel = transform.k;
    }
  };

  const handleZoomToFit = () => {
    graphRef.current?.zoomToFit(500);
  };

  const handleNodeDoubleClick = (node: NodeData) => {
    if (node && node.id && node.type === 'module') {
      const newData = getPrunedGraph(graphData.nodes, node.id);
      const selectedPath = selectedModule?.modules.join('/');
      const newPath = node.modules?.join('/');
      if (selectedPath !== newPath) {
        dispatch(setSelectedData(newData));
        dispatch(setSelectedModule(node));
        dispatch(setSelectedNode(null));
      }
    }
  };

  const handleNodeClick = (obj: NodeObject, event: MouseEvent) => {
    const node = obj as NodeData;

    // handle double click
    configRef.current.clickCount += 1;
    setTimeout(() => {
      if (configRef.current.clickCount === 2) {
        handleNodeDoubleClick(node);
      }
      configRef.current.clickCount = 0;
    }, 300);

    // handle click
    if (selectedNode?.id !== node.id) {
      dispatch(setSelectedNode(_.omit(node, ['vx', 'vy'])));
    } else {
      dispatch(setSelectedNode(null));
    }
  };

  const handleNodeHover = (
    obj: NodeObject | null,
    previousNode: NodeObject | null
  ) => {
    graphRef.current?.d3ReheatSimulation(); // redraw
    const node = obj as NodeData;
    if (node && node.id) {
      const { nodes, links } = getPrunedGraph(graphData.nodes, node.id);
      configRef.current.hoverNode = node || null;
      configRef.current.highlightNodes = nodes;
      configRef.current.highlightLinks = links;
    } else {
      configRef.current.hoverNode = null;
      configRef.current.highlightNodes = [];
      configRef.current.highlightLinks = [];
    }
  };

  const handleNodeDrag = (
    obj: NodeObject,
    translate: { x: number; y: number }
  ) => {
    const node = obj as NodeData;
    configRef.current.dragNode = node;
    dispatch(setSelectedNode(null));
  };

  const handleNodeDragEnd = (
    obj: NodeObject,
    translate: { x: number; y: number }
  ) => {
    const node = obj as NodeData;
    configRef.current.dragNode = null;
    dispatch(setSelectedNode(_.omit(node, ['vx', 'vy'])));
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
    linkColor,
    linkDirectionalArrowColor,
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
    onNodeClick: handleNodeClick,
    onNodeHover: handleNodeHover,
    onNodeDrag: handleNodeDrag,
    onNodeDragEnd: handleNodeDragEnd,
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
  dragNode: NodeData | null;
  hoverNode: NodeData | null;
  highlightNodes: NodeData[];
  highlightLinks: LinkData[];
  clickCount: number;
}
