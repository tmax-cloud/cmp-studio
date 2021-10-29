import * as React from 'react';
import { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import { forceManyBody, forceCollide, forceLink } from 'd3-force';
import { NodeData, LinkData } from '@renderer/types/graph';
import { drawNode } from '@renderer/utils/graph/draw';

const initialConfig: GraphConfig = {
  isMounted: false,
  zoomLevel: 1,
  hoverNode: null,
  highlightNodes: new Set<NodeData>(),
  highlightLinks: new Set<LinkData>(),
};

const NODE_RADIUS = 25;

export const useGraphProps = () => {
  const graphRef = React.useRef<ForceGraphMethods>();
  const configRef = React.useRef<GraphConfig>(initialConfig);

  const nodeCanvasObject = (obj: NodeObject, ctx: CanvasRenderingContext2D) => {
    const node = obj as NodeData;
    const x = node?.x || 0;
    const y = node?.y || 0;
    drawNode(
      ctx,
      x - NODE_RADIUS,
      y - NODE_RADIUS,
      NODE_RADIUS * 2,
      NODE_RADIUS * 2,
      4,
      node,
      node === configRef.current.hoverNode
    );
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

  /*const handleNodeHover = (
    obj: NodeObject | null,
    previousNode: NodeObject | null
  ) => {
    const highlightNodes = new Set<NodeData>();
    const highlightLinks = new Set<LinkData>();
    const node = obj as NodeData;
    if (node) {
      highlightNodes.add(node);
      node.childNodes?.forEach((neighborNode: NodeData) =>
        highlightNodes.add(neighborNode)
      );
      node.childLinks?.forEach((neighborLink: LinkData) =>
        highlightLinks.add(neighborLink)
      );
    }
    configRef.current.hoverNode = node || null;
    configRef.current.highlightNodes = highlightNodes;
    configRef.current.highlightLinks = highlightLinks;
  };*/

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
    nodeLabel: 'simpleName',
    nodeRelSize: NODE_RADIUS,
    nodeCanvasObject,
    dagMode: 'td' as DagMode,
    dagLevelDistance: NODE_RADIUS * 2 + 10,
    cooldownTime: 1000,
    d3AlphaDecay: 0.5,
    enableZoomInteraction: false,
    //autoPauseRedraw: false,
    onEngineTick: handleEngineTick,
    onEngineStop: handleEngineStop,
    onZoomEnd: handleZoomEnd,
    //onNodeHover: handleNodeHover,
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
  highlightNodes: Set<NodeData>;
  highlightLinks: Set<LinkData>;
}
