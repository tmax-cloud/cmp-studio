import * as React from 'react';
import { styled, Theme } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import TopologySidebar, { SIDEBAR_WIDTH } from './TopologySidebar';
import TopologySidePanel, { SIDEPANEL_WIDTH } from './TopologySidePanel';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import parseJson from '../form/utils/json2JsonSchemaParser';
// import testSchema from '../form/test_schema.json';
import TopologyToolbar from './toolbar';
import TopologyGraphLayout from './graph';
import { useGraphProps } from '../../hooks/useGraphProps';

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

export const TopologyPage: React.FC = (props) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [sidePanelData, setSidePanelData] = React.useState({});
  const [terraformSchema, setTerraformSchema] = React.useState(new Map());

  React.useEffect(() => {
    const schema = parseJson('aws');
    // schema.set('arrayTest', testSchema.arrayTest);
    // schema.set('textareaTest', testSchema.textareaTest);
    setTerraformSchema(schema);
  }, []);

  const { graphRef, graphOption, graphHandler } = useGraphProps();

  const classes = useStyles({ isSidePanelOpen });
  const openSidePanel = (data: any) => {
    if (!isSidePanelOpen) {
      setIsSidePanelOpen(true);
    }
    setSidePanelData(data);
  };

  return (
    <TopologyLayoutRoot>
      <TopologySidebar openSidePanel={openSidePanel} />
      <div className={classes.topologyLayoutWrapper}>
        <TopologyToolbar handlers={graphHandler} />
        <TopologyGraphLayout graphRef={graphRef} graphOptions={graphOption} />
      </div>
      <TopologySidePanel
        open={isSidePanelOpen}
        toggleSidePanel={setIsSidePanelOpen}
        data={sidePanelData}
        terraformSchemaMap={terraformSchema}
      />
    </TopologyLayoutRoot>
  );
};
