import * as React from 'react';
import ForceGraph2D, {
  ForceGraphMethods,
  ForceGraphProps,
  GraphData,
} from 'react-force-graph-2d';
import { withResizeDetector } from 'react-resize-detector';
import Box from '@mui/material/Box';
import Error from './Error';

const TopologyGraph = (props: TopologyGraphProps) => {
  const { width, height, graphRef, graphOptions, graphData } = props;
  const isError = !width || !height || graphData.error;

  React.useEffect(() => {
    graphRef.current?.zoomToFit(500);
  }, [graphRef, width, height]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {isError ? (
        <Error message={graphData.error} />
      ) : (
        <ForceGraph2D
          ref={graphRef}
          width={width}
          height={height}
          graphData={graphData.data as GraphData}
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
  graphRef: React.MutableRefObject<ForceGraphMethods | undefined>;
  graphOptions: ForceGraphProps;
  graphData: {
    data: GraphData;
    error?: string;
  };
}

export type TopologyGraphProps = GraphSizeProps & GraphProps;

export default withResizeDetector(TopologyGraph);
