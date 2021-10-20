import * as React from 'react';
import {
  Box,
  Button,
  Drawer,
  List,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  InputLabel,
  Select,
  TextField,
} from '@mui/material';
import {
  AcUnit,
  FilterVintage,
  Storage,
  Mode,
  Circle,
  ArrowDownward,
  ArrowUpward,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { OptionProperties } from '@main/dialog/common/dialog';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import { dummySchema } from './dummy';
//import InputLabel from '@mui/material/InputLabel';
//import Select from '@mui/material/Select';

export const SIDEBAR_WIDTH = '300px';

const useStyles = makeStyles({
  tab: {
    width: '50%',
  },
  popperPaper: {
    // specZ: The maximum height of a simple menu should be one or more rows less than the view
    // height. This ensures a tapable area outside of the simple menu with which to dismiss
    // the menu.
    maxHeight: 'calc(100% - 96px)',
    // Add iOS momentum scrolling.
    WebkitOverflowScrolling: 'touch',
  },
  contextMenuList: {
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
  },
  menuItem: {
    fontSize: '12px',
  },
  menuItemText: { width: '120px', textAlign: 'start' },
});

const getIcon = (type: string) => {
  switch (type) {
    case 'provider':
      return <AcUnit />;
    case 'resource':
      return <FilterVintage />;
    case 'datasource':
      return <Storage />;
    case 'module':
      return <Mode />;
    default:
      return <Circle />;
  }
};

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

type TabPanelProps = {
  children: React.ReactNode;
  index: number;
  value: number;
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function seartchDisplayName(searchText: string, displayName: string) {
  if (displayName.toUpperCase().indexOf(searchText.toUpperCase()) !== -1) {
    return true;
  } else {
    return false;
  }
}

interface Item {
  provider?: string;
  title: string;
  displayName: string;
  type: string;
}

const ShowItemList: React.FC<ShowItemListProps> = ({ items, title }) => {
  const [isShow, setIsShow] = React.useState(true);
  const testFunc = (displayName: string) => {
    alert('Hi ' + displayName);
  };
  return (
    <div>
      <Button onClick={() => setIsShow(!isShow)} color="inherit" fullWidth>
        {title}
        <span style={{ marginRight: '10px', float: 'right' }}>
          {isShow ? <ArrowUpward /> : <ArrowDownward />}
        </span>
      </Button>
      <List>
        {isShow &&
          items.map((item, index) => {
            return (
              <Button
                key={`button-${index}`}
                startIcon={getIcon(item.type)}
                onClick={() => testFunc(item.displayName)}
              >
                {item.displayName}
              </Button>
            );
          })}
      </List>
    </div>
  );
};
type ShowItemListProps = {
  items: Item[];
  title: string;
};

const TopologyLibrary: React.FC<TopologyLibraryProps> = ({ items }) => {
  const classes = useStyles();
  const history = useHistory();
  //const [items, setItems] = React.useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<Item[]>([]);
  const [prjContextMenuOpen, setPrjContextMenuOpen] = React.useState(false);
  const [prjAnchorEl, setPrjAnchorEl] = React.useState(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const handleTabChange = (event: any, newValue: number) => {
    setTabIndex(newValue);
  };
  const [porvider, setPorvider] = React.useState('');
  const [porviderItems, setPorviderItems] = React.useState<Item[]>([]);
  const [resourceItems, setResourceItems] = React.useState<Item[]>([]);
  const [datasourceItems, setdatasourceItems] = React.useState<Item[]>([]);
  const porviderHandleChange = (event: any) => {
    setPorvider(event.target.value);
  };
  const [localModuleItems, setLocalModuleItems] = React.useState<Item[]>([]);
  const [terraformModuleItems, setTerraformModuleItems] = React.useState<
    Item[]
  >([]);
  const [searchText, setSearchText] = React.useState('');
  const searchTextChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const clickAwayHandler = () => {
    setPrjContextMenuOpen(false);
  };

  React.useEffect(() => {
    const filteredList: Item[] = [];
    const providerList: Item[] = [];
    const resourceList: Item[] = [];
    const datasourceList: Item[] = [];
    const moduleList: Item[] = [];
    items.forEach((i: Item) => {
      if (i.provider === porvider) {
        if (seartchDisplayName(searchText, i.displayName)) {
          if (i.type === 'provider') {
            providerList.push({
              provider: i.provider,
              title: i.title,
              displayName: i.displayName,
              type: i.type,
            });
          }
          if (i.type === 'resource') {
            resourceList.push({
              provider: i.provider,
              title: i.title,
              displayName: i.displayName,
              type: i.type,
            });
          }
          if (i.type === 'datasource') {
            datasourceList.push({
              provider: i.provider,
              title: i.title,
              displayName: i.displayName,
              type: i.type,
            });
          }
          if (i.type === 'module') {
            moduleList.push({
              provider: i.provider,
              title: i.title,
              displayName: i.displayName,
              type: i.type,
            });
          }
        }
      }
    });
    const localList: Item[] = [];
    localList.push({
      title: 'module-local_module_1',
      displayName: 'local_module_1',
      type: 'module',
    });
    setLocalModuleItems(localList);

    setFilteredItems(filteredList);
    setPorviderItems(providerList);
    setResourceItems(resourceList);
    setdatasourceItems(datasourceList);
    setTerraformModuleItems(moduleList);
  }, [porvider, searchText]);

  React.useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:dirPathToOpen',
      (res: { canceled: boolean; filePaths: string[] }) => {
        const { filePaths, canceled } = res;
        if (!canceled) {
          window.electron.ipcRenderer
            .invoke('studio:openExistFolder', { folderUri: filePaths[0] })
            .then((response: any) => {
              const uid = response?.data?.uid;
              if (uid) {
                history.push(`/main/${uid}`);
              }
              return response;
            })
            .catch((err: any) => {
              console.log('[Error] Failed to open exist folder : ', err);
            });
        }
      }
    );
  }, [history]);

  const onProjectTabClick = (event: any) => {
    // Mouse Right Click
    if (event.button === 2) {
      setPrjAnchorEl(event.currentTarget);
      setPrjContextMenuOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <InputLabel id="demo-simple-select-label">Porvider</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={porvider}
          label="Porvider"
          onChange={porviderHandleChange}
          placeholder="프로바이더 선택"
          fullWidth
        >
          <MenuItem value="aws">AWS</MenuItem>
          <MenuItem value="test">TEST</MenuItem>
          <MenuItem value="empty">EMPTY</MenuItem>
        </Select>
        <TextField
          id="outlined-searchText"
          label="SearchText"
          value={searchText}
          onChange={searchTextChange}
        />
        <ShowItemList items={localModuleItems} title="로컬 모듈" />
        <ShowItemList items={porviderItems} title="테라폼 디폴트" />
        <ShowItemList items={terraformModuleItems} title="테라폼 모듈" />
        <ShowItemList items={resourceItems} title="테라폼 리소스" />
        <ShowItemList items={datasourceItems} title="테라폼 데이터소스" />
      </Box>
    </>
  );
};

type TopologyLibraryProps = {
  items: any;
};
export default TopologyLibrary;
