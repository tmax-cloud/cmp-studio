import * as React from 'react';
import * as _ from 'lodash-es';
import { Tabs, Tab, Box } from '@mui/material';
import EditorTab from './Editor';

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

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
  const { schema, formData, uiSchema } = props;
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
          <Tab label="상태" {...a11yProps(1)} />
          <Tab label="Diff" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <EditorTab schema={schema} formData={formData} uiSchema={uiSchema} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        상태 (구현 예정...)
      </TabPanel>
      <TabPanel value={value} index={2}>
        Diff (구현 예정...)
      </TabPanel>
    </>
  );
};

type FormTabsProps = {
  schema: any;
  formData: any;
  uiSchema: any;
};

export default FormTabs;
