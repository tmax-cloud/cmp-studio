import * as React from 'react';
import { ForceGraphMethods } from 'react-force-graph-2d';

const initialConfig = {
  isMounted: false,
  zoomLevel: 1,
};

export const useGraphProps = () => {
  const graphRef = React.useRef<ForceGraphMethods>();
  const configRef = React.useRef<GraphConfig>(initialConfig);

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

  const handleEngineStop = () => {
    if (!configRef.current.isMounted) {
      handleZoomToFit();
      configRef.current.isMounted = true;
    }
  };

  const graphOption = {
    nodeLabel: 'name',
    dagMode: 'td' as DagMode,
    dagLevelDistance: 40,
    enableZoomInteraction: false,
    cooldownTicks: 50,
    onEngineStop: handleEngineStop,
    onZoomEnd: handleZoomEnd,
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
}
