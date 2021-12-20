import * as React from 'react';
import * as _ from 'lodash';
import ForceGraph2D, {
  ForceGraphMethods,
  ForceGraphProps,
} from 'react-force-graph-2d';
import { withResizeDetector } from 'react-resize-detector';
import { useAppSelector, useAppDispatch } from '@renderer/app/store';
import { useGraphData } from '@renderer/hooks/useGraphData';
import { useGraphInitOutput } from '@renderer/hooks/useGraphInitOutput';
import {
  selectErrorMsg,
  selectSelectedData,
} from '@renderer/features/graphSliceInputSelectors';
import { setLoadingModal, setLoadingMsg } from '@renderer/features/uiSlice';
import { selectUiLoadingMsg } from '@renderer/features/uiSliceInputSelectors';
import { INIT_FINISHED } from '@renderer/utils/graph';
import Box from '@mui/material/Box';
import Error from './Error';

const TopologyGraph = (props: TopologyGraphProps) => {
  const { width, height, graphRef, graphOptions } = props;

  const dispatch = useAppDispatch();
  const selectedData = useAppSelector(selectSelectedData);

  const graphData = useGraphData(selectedData);

  useGraphInitOutput();
  const loadingMsg = useAppSelector(selectUiLoadingMsg);
  const errorMsg = useAppSelector(selectErrorMsg);
  const isInitFinished = !loadingMsg || loadingMsg === INIT_FINISHED;
  const isLoadFinished = isInitFinished && !loadingMsg;
  React.useEffect(() => {
    dispatch(setLoadingMsg(loadingMsg as string | null));
    dispatch(setLoadingModal(!isLoadFinished));
  }, [isInitFinished, loadingMsg, isLoadFinished, errorMsg, dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* {!isLoadFinished || errorMsg ? (
        <> */}
      <Error isLoading={!isLoadFinished} message={errorMsg} />
      {/* <GraphLoadingModal
            isOpen={!isLoadFinished}
            initMsg={initOutputMsg}
            loadingMsg={loadingMsg}
          /> */}
      {/* </>
      ) : ( */}
      <ForceGraph2D
        ref={graphRef}
        width={width}
        height={height}
        graphData={graphData}
        {...graphOptions}
      />
      {/* )} */}
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
