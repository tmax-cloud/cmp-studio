import * as React from 'react';
import { ForceGraphMethods } from 'react-force-graph-2d';

const INITIAL_ZOOM_LEVEL = 2;

export const useGraphProps = () => {
  const [zoomLevel, setZoomLevel] = React.useState(INITIAL_ZOOM_LEVEL);

  const graphRef = React.useRef<ForceGraphMethods>();

  const handleZoomIn = () => {
    graphRef.current?.zoom(zoomLevel + 1);
  };

  const handleZoomOut = () => {
    graphRef.current?.zoom(zoomLevel - 1);
  };

  const handleZoomEnd = (transform: { k: number; x: number; y: number }) => {
    zoomLevel !== transform.k && setZoomLevel(transform.k);
  };

  const handleZoomToFit = () => {
    graphRef.current?.zoomToFit(0, 100);
  };

  const graphOption: GraphOptionProps = {
    enableZoomInteraction: false,
    onZoomEnd: handleZoomEnd,
  };

  const graphHandler: GraphHandlerProps = {
    handleZoomIn,
    handleZoomOut,
    handleZoomToFit,
  };

  return { graphRef, graphOption, graphHandler };
};

export type GraphRef = React.MutableRefObject<ForceGraphMethods | undefined>;

export interface GraphOptionProps {
  enableZoomInteraction: boolean;
  onZoomEnd: (transform: { k: number; x: number; y: number }) => void;
}

export interface GraphHandlerProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomToFit: () => void;
}
