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
  selectLoadingMsg,
} from '@renderer/features/graphSliceInputSelectors';
import { INIT_FINISHED } from '@renderer/utils/graph/terraform';
import Box from '@mui/material/Box';
import Error from './Error';
import { GraphLoadingModal } from '../modal';

const TopologyGraph = (props: TopologyGraphProps) => {
  const { width, height, graphRef, graphOptions } = props;

  const originGraphData = useAppSelector(selectGraphData);
  const graphData = useGraphData(originGraphData);

  const initOutputMsg = useGraphInitOutput();
  const loadingMsg = useAppSelector(selectLoadingMsg);
  const errorMsg = useAppSelector(selectErrorMsg);
  const isInitFinished = !initOutputMsg || initOutputMsg === INIT_FINISHED;
  const isLoadFinished = isInitFinished && !loadingMsg;

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
      {!isLoadFinished || errorMsg ? (
        <>
          <Error isLoading={!isLoadFinished} message={errorMsg} />
          <GraphLoadingModal
            isOpen={!isLoadFinished}
            initMsg={initOutputMsg}
            loadingMsg={loadingMsg}
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
