import * as React from 'react';
import * as _ from 'lodash';
import ForceGraph2D, {
  ForceGraphMethods,
  ForceGraphProps,
} from 'react-force-graph-2d';
import { withResizeDetector } from 'react-resize-detector';
import { useAppSelector } from '@renderer/app/store';
import { useGraphData, useGraphInitOutput } from '@renderer/hooks/useGraphData';
import {
  selectErrorMsg,
  selectGraphData,
} from '@renderer/features/graphSliceInputSelectors';
import Box from '@mui/material/Box';
import Error from './Error';
import { GraphLoadingModal } from '../modal';

const TopologyGraph = (props: TopologyGraphProps) => {
  const { width, height, graphRef, graphOptions } = props;

  const originGraphData = useAppSelector(selectGraphData);
  const graphData = useGraphData(originGraphData);

  const initOutputMsg = useGraphInitOutput();
  const errorMsg = useAppSelector(selectErrorMsg);

  const isError = errorMsg || _.isEmpty(graphData.nodes);

  React.useEffect(() => {
    graphRef.current?.zoomToFit();
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
        <>
          <Error message={errorMsg} />
          <GraphLoadingModal
            isOpen={!errorMsg || !!initOutputMsg}
            message={initOutputMsg}
          />
        </>
      ) : (
        <ForceGraph2D
          ref={graphRef}
          width={width}
          height={height}
          graphData={graphData}
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
