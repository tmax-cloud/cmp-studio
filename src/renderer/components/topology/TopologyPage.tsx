import * as React from 'react';
import {
  Box,
  styled,
  Theme,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { setSchemaMap } from '@renderer/utils/storageAPI';
import { useGraphProps } from '@renderer/hooks/useGraphProps';
import { fetchGraphDataByWorkspaceId } from '@renderer/features/graphSlice';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import {
  selectUiToggleSidePanel,
  selectUiCommandPage,
  selectUiLoadingModal,
  selectUiLoadingMsg,
} from '@renderer/features/uiSliceInputSelectors';
import { setCommandPage } from '@renderer/features/uiSlice';

import TopologySidebar, { SIDEBAR_WIDTH } from './TopologySidebar';
import TopologySidePanel, { SIDEPANEL_WIDTH } from './TopologySidePanel';
import TopologyToolbar from './toolbar/TopologyToolbar';
import TopologyGraph from './graph/TopologyGraph';
import TopologyCommand from './command/TopologyCommand';
import LoadingModal from './modal/LoadingModal';
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
  const isCommandPageOpen = useAppSelector(selectUiCommandPage);
  const isLoadingModalOpen = useAppSelector(selectUiLoadingModal);
  const loadingMsg = useAppSelector(selectUiLoadingMsg);
  const dispatch = useAppDispatch();
  const [alignment, setAlignment] = React.useState('graph');

  React.useEffect(() => {
    dispatch(fetchGraphDataByWorkspaceId(workspaceUid));
  }, [dispatch, workspaceUid]);

  // if (!localStorage.getItem('schemaJson')) {
  const schemaJson = parseJson(['aws', 'tls']);
  setSchemaMap(JSON.stringify(Array.from(schemaJson.entries())));
  // }
  const { graphRef, graphOption, graphHandler } = useGraphProps();

  const classes = useStyles({ isSidePanelOpen });

  const handleToggle = (event: React.MouseEvent, newAlignment: string) => {
    setAlignment(newAlignment);
    dispatch(setCommandPage(newAlignment === 'command'));
  };

  return (
    <TopologyLayoutRoot>
      <LoadingModal isOpen={isLoadingModalOpen} loadingMsg={loadingMsg} />
      <ToggleButtonGroup
        sx={{ position: 'absolute', left: '330px', top: '126px', zIndex: '1' }}
        color="primary"
        value={alignment}
        exclusive
        onChange={handleToggle}
      >
        <ToggleButton value="graph">Graph</ToggleButton>
        <ToggleButton value="command">command</ToggleButton>
      </ToggleButtonGroup>
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
          {isCommandPageOpen ? (
            <TopologyCommand />
          ) : (
            <TopologyGraph graphRef={graphRef} graphOptions={graphOption} />
          )}
          <TopologySidePanel />
        </div>
      </Box>
    </TopologyLayoutRoot>
  );
};
