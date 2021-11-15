import * as React from 'react';
import * as _ from 'lodash-es';
import { Tabs, Tab, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EditorTab from './form/Editor';
import StateTab from './state/State';
import DiffTab from './diff/Diff';
const useStyles = makeStyles({
  root: {
    overflow: 'auto',
  },
});

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className={classes.root}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
};

type TabPanelProps = {
  children: any;
  index: number;
  value: any;
};
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const FormTabs = (props: FormTabsProps) => {
  const { schema, formData, uiSchema, toggleSidePanel } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="에디터" {...a11yProps(0)} />
          <Tab label="Diff (가공 전)" {...a11yProps(1)} />
          <Tab label="Diff (가공 후 - 진행중)" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <EditorTab
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          toggleSidePanel={toggleSidePanel}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StateTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DiffTab />
      </TabPanel>
    </>
  );
};

type FormTabsProps = {
  schema: any;
  formData: any;
  uiSchema: any;
  toggleSidePanel: any;
};

export default FormTabs;
