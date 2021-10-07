import * as React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { withResizeDetector } from 'react-resize-detector';
import Box from '@mui/material/Box';
import { GraphRef, GraphOptionProps } from 'renderer/hooks/useGraphProps';

const TopologyGraph = (props: TopologyGraphProps) => {
  const { width, height, graphRef, graphOptions } = props;

  React.useEffect(() => {
    graphRef.current?.zoomToFit(0, 100);
  }, [graphRef]);

  const genRandomTree = (N = 10, reverse = false) => {
    return {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          [reverse ? 'target' : 'source']: id,
          [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
        })),
    };
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {width && height && (
        <ForceGraph2D
          ref={graphRef}
          width={width}
          height={height}
          graphData={genRandomTree()}
          {...graphOptions}
        />
      )}
    </Box>
  );
};

export interface GraphSizeProps {
  width: number;
  height: number;
}
export interface GraphProps {
  graphRef: GraphRef;
  graphOptions: GraphOptionProps;
}

export type TopologyGraphProps = GraphSizeProps & GraphProps;

export default withResizeDetector(TopologyGraph);
