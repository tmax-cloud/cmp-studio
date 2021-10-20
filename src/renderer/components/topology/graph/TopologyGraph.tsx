import * as React from 'react';
import ForceGraph2D, {
  ForceGraphMethods,
  ForceGraphProps,
  GraphData,
} from 'react-force-graph-2d';
import { withResizeDetector } from 'react-resize-detector';
import Box from '@mui/material/Box';
import { useGraphData } from '@renderer/hooks/useGraphData';

const Error = () => <Box p={2}>Oh no! Something went wrong.</Box>;

const TopologyGraph = (props: TopologyGraphProps) => {
  const { width, height, graphRef, graphOptions } = props;
  const graphData = useGraphData();
  const isError = !width || !height || graphData.error !== '';

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
        <Error />
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
}

export type TopologyGraphProps = GraphSizeProps & GraphProps;

export default withResizeDetector(TopologyGraph);
