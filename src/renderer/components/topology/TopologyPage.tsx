import * as React from 'react';
import { Box, styled, Theme } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { setSchemaMap } from '@renderer/utils/storageAPI';
import { useGraphProps } from '@renderer/hooks/useGraphProps';
import { fetchGraphDataByWorkspaceId } from '@renderer/features/graphSlice';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import { selectUiToggleSidePanel } from '@renderer/features/uiSliceInputSelectors';
import TopologySidebar, { SIDEBAR_WIDTH } from './TopologySidebar';
import TopologySidePanel, { SIDEPANEL_WIDTH } from './TopologySidePanel';
import TopologyToolbar from './toolbar/TopologyToolbar';
import TopologyGraph from './graph/TopologyGraph';
import TopologyCommand from './command/TopologyCommand';
import parseJson from './state/form/utils/json2JsonSchemaParser';

type StyleProps = {
  isSidePanelOpen?: boolean;
};
const TopologyLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const useStyles = makeStyles<Theme, StyleProps>((theme) =>
  createStyles({
    topologyLayoutWrapper: {
      display: 'flex',
      flex: '1 1 auto',
      overflow: 'hidden',
      marginRight: (props) => (props.isSidePanelOpen ? SIDEPANEL_WIDTH : 0),
    },
  })
);

export const TopologyPage = () => {
  const workspaceUid = useAppSelector(selectWorkspaceUid);
  const isSidePanelOpen = useAppSelector(selectUiToggleSidePanel);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchGraphDataByWorkspaceId(workspaceUid));
  }, [dispatch, workspaceUid]);

  // if (!localStorage.getItem('schemaJson')) {
  const schemaJson = parseJson(['aws', 'tls']);
  setSchemaMap(JSON.stringify(Array.from(schemaJson.entries())));
  // }
  const { graphRef, graphOption, graphHandler } = useGraphProps();

  const classes = useStyles({ isSidePanelOpen });

  return (
    <TopologyLayoutRoot>
      <Box sx={{ width: SIDEBAR_WIDTH }}>
        <TopologySidebar />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: `calc(100% - ${SIDEBAR_WIDTH})`,
        }}
      >
        <TopologyToolbar handlers={graphHandler} />
        <div className={classes.topologyLayoutWrapper}>
          <TopologyCommand />
          {/* <TopologyGraph graphRef={graphRef} graphOptions={graphOption} /> */}
          <TopologySidePanel />
        </div>
      </Box>
    </TopologyLayoutRoot>
  );
};
