import * as React from 'react';
import * as _ from 'lodash-es';
import { styled, Theme } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { setSchemaMap } from '@renderer/utils/storageAPI';
import { useGraphProps } from '@renderer/hooks/useGraphProps';
import { useGraphData } from '@renderer/hooks/useGraphData';
import TopologySidebar, { SIDEBAR_WIDTH } from './TopologySidebar';
import TopologySidePanel, { SIDEPANEL_WIDTH } from './TopologySidePanel';
// import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import parseJson from '../form/utils/json2JsonSchemaParser';
import TopologyToolbar from './toolbar/TopologyToolbar';
import TopologyGraph from './graph/TopologyGraph';

// MEMO : SIDEBAR_WIDTH + SIDEPANEL_WIDTH 값
const sidebarAndPanelWidth = '800px';

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

// const TopologyLayoutWrapper = styled('div')(({ theme }) => ({
//   display: 'flex',
//   flex: '1 1 auto',
//   overflow: 'hidden',
//   paddingTop: TOP_NAVBAR_HEIGHT,
//   width: `calc(100% - ${SIDEBAR_WIDTH})`,
//   height: '100%',
//   marginLeft: SIDEBAR_WIDTH,
// }));

// MEMO : sidepanel 열릴 때 topology 크기도 줄여야 하나? 안줄여도 되면 위에 주석처리된 TopologyLayoutWrapper 사용해도 됨.
const useStyles = makeStyles<Theme, StyleProps>((theme) =>
  createStyles({
    topologyLayoutWrapper: {
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column',
      overflow: 'hidden',
      width: (props) =>
        props.isSidePanelOpen
          ? `calc(100% - ${sidebarAndPanelWidth})`
          : `calc(100% - ${SIDEBAR_WIDTH})`,
      height: '100%',
      marginLeft: SIDEBAR_WIDTH,
      marginRight: (props) => (props.isSidePanelOpen ? SIDEPANEL_WIDTH : 0),
    },
  })
);

export const TopologyPage: React.FC<TopologyPageProps> = (props) => {
  const { workspaceUid } = props;
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);

  if (!localStorage.getItem('schemaJson')) {
    const schemaJson = parseJson('aws');
    setSchemaMap(JSON.stringify(Array.from(schemaJson.entries())));
  }
  const { graphRef, graphOption, graphHandler } = useGraphProps();
  const graphData = useGraphData(workspaceUid);

  const classes = useStyles({ isSidePanelOpen });

  return (
    <TopologyLayoutRoot>
      <TopologySidebar setIsSidePanelOpen={setIsSidePanelOpen} />
      <div className={classes.topologyLayoutWrapper}>
        <TopologyToolbar handlers={graphHandler} />
        <TopologyGraph
          graphRef={graphRef}
          graphOptions={graphOption}
          graphData={graphData}
        />
      </div>
      <TopologySidePanel
        isSidePanelOpen={isSidePanelOpen}
        toggleSidePanel={setIsSidePanelOpen}
      />
    </TopologyLayoutRoot>
  );
};

interface TopologyPageProps {
  workspaceUid: string;
}
