import * as React from 'react';
import * as ReactDOM from 'react-dom';
import _ from 'lodash';
import {
  Box,
  Button,
  Drawer,
  List,
  Tabs,
  Tab,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  ThemeProvider,
} from '@mui/material';
import { AcUnit, FilterVintage, Storage, Circle } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { OptionProperties, OpenType } from '@main/dialog/common/dialog';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';
import { selectCodeFileObjects } from '@renderer/features/codeSliceInputSelectors';
import parseToCustomizeKey from './state/form/utils/parseToCustomizeKey';
import { getObjectNameInfo } from './state/form/utils/getResourceInfo';
import {
  openExistFolder,
  getProjectJson,
} from '../../utils/ipc/workspaceIpcUtils';
import { openDialog } from '../../utils/ipc/dialogIpcUtils';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import TopologyLibrary from './TopologyLibrary';
import {
  setSelectedObjectInfo,
  setFileObjects,
  setMapObjectTypeCollection,
} from '../../features/codeSlice';
import { setSidePanel } from '../../features/uiSlice';

import { setWorkspaceUid } from '../../features/commonSlice';
import CreateWorkspaceModal from '../workspace/CreateWorkspaceModal';
import StudioTheme from '../../theme';

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

export const getIcon = (type: string) => {
  switch (type) {
    case 'provider':
      return <AcUnit />;
    case 'resource':
      return <FilterVintage />;
    case 'datasource':
      return <Storage />;
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

interface Item {
  provider?: string;
  title: string;
  resourceName: string;
  instanceName: string;
  type: string;
}

const TopologySidebar = () => {
  const classes = useStyles();
  const history = useHistory();
  const [items, setItems] = React.useState<Item[]>([]);
  const [prjContextMenuOpen, setPrjContextMenuOpen] = React.useState(false);
  const [prjAnchorEl, setPrjAnchorEl] = React.useState(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const dispatch = useAppDispatch();
  const handleTabChange = (event: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const openWorkspaceFromTopologySidebar = async (folderUri: string) => {
    const args: WorkspaceTypes.WorkspaceOpenProjectArgs = {
      folderUri,
    };
    openExistFolder(args)
      .then(async (response: any) => {
        const uid = response?.data?.uid;
        if (uid) {
          const projectJsonRes = await getProjectJson(args);
          const { mapObjectTypeCollection, data } = parseToCustomizeKey(
            projectJsonRes.data
          );
          dispatch(setMapObjectTypeCollection(mapObjectTypeCollection));
          dispatch(setFileObjects(data));
          history.push(`/main/${uid}`);
          dispatch(setWorkspaceUid(uid));
        }
        return response;
      })
      .catch((err: any) => {
        console.log('[Error] Failed to open exist folder : ', err);
      });
  };

  const clickAwayHandler = () => {
    setPrjContextMenuOpen(false);
  };

  const objResult: any[] = [];

  // useSelector로 반환한 배열에 대해 반복문을 돌면서 objResult를 변경시킴... refactor할 예정
  const fileObjects = useAppSelector(selectCodeFileObjects);
  fileObjects.forEach((file: { filePath: string; fileJson: any }) => {
    // eslint-disable-next-line guard-for-in
    for (const currKey in file.fileJson) {
      objResult.push(
        ..._.entries(file.fileJson[currKey]).map((object) => ({
          [object[0]]: object[1],
          type: currKey,
        }))
      );
    }
  });

  React.useEffect(() => {
    const itemsList: Item[] = [];
    objResult
      .filter((result) => {
        const { type, ...object } = result;
        const { instanceName } = getObjectNameInfo(object, type);
        return !!instanceName;
      })
      .map((result) => {
        const { type, ...object } = result;
        const { resourceName, instanceName } = getObjectNameInfo(object, type);
        const title = !!resourceName
          ? type + '/' + resourceName
          : type + '/' + instanceName;
        return { type, resourceName, title, instanceName };
      })
      .forEach((i: Item) => {
        itemsList.push({
          provider: i.resourceName.split('_')[0],
          title: i.title,
          instanceName: i.instanceName,
          resourceName: i.resourceName,
          type: i.type,
        });
      });
    setItems(itemsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname, fileObjects]);

  React.useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:dirPathToOpen',
      (res: { canceled: boolean; filePaths: string[] }) => {
        const { filePaths, canceled } = res;
        if (!canceled) {
          openWorkspaceFromTopologySidebar(filePaths[0]);
        }
      }
    );
  }, []);

  const onObjectTabClick = (event: any) => {
    // Mouse Right Click
    if (event.button === 2) {
      setPrjAnchorEl(event.currentTarget);
      setPrjContextMenuOpen(true);
    }
  };

  const content = (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab
            className={classes.tab}
            label="Object"
            {...a11yProps(0)}
            onMouseDown={onObjectTabClick}
          />
          <Tab className={classes.tab} label="Library" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <List>
          {items.map((item, index) => {
            return (
              <Button
                key={`button-${index}`}
                startIcon={getIcon(item.type)}
                onClick={() => {
                  const content = objResult.filter((cur: any) => {
                    const { type, ...obj } = cur;
                    const { resourceName, instanceName } = getObjectNameInfo(
                      obj,
                      type
                    );
                    const title = !!resourceName
                      ? type + '/' + resourceName
                      : type + '/' + instanceName;
                    return item.title === title;
                  });
                  const object = {
                    id: item.title,
                    instanceName: item.instanceName,
                    content: content[0],
                  };

                  dispatch(setSelectedObjectInfo(object));
                  dispatch(setSidePanel(true));
                }}
              >
                {item.resourceName ? item.resourceName : item.instanceName}
              </Button>
            );
          })}
        </List>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <TopologyLibrary />
      </TabPanel>
    </Box>
  );

  return (
    <>
      <ClickAwayListener onClickAway={clickAwayHandler}>
        <Popper
          id="project-contextmenu-popper"
          style={{ zIndex: 8000, inset: '-25px auto auto 70px' }}
          open={prjContextMenuOpen}
          anchorEl={prjAnchorEl}
          placement="bottom-start"
        >
          {({ TransitionProps }) => (
            <Paper className={classes.popperPaper}>
              <MenuList className={classes.contextMenuList} autoFocus>
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => {
                    setPrjContextMenuOpen(false);
                    ReactDOM.render(
                      <ThemeProvider theme={StudioTheme}>
                        <CreateWorkspaceModal
                          history={history}
                          openWorkspace={openWorkspaceFromTopologySidebar}
                        />
                      </ThemeProvider>,
                      document.getElementById('modal-container')
                    );
                  }}
                >
                  <span className={classes.menuItemText}>새 프로젝트 생성</span>
                  <span>Ctrl+N</span>
                </MenuItem>
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => {
                    setPrjContextMenuOpen(false);
                    const properties: OptionProperties = ['openDirectory'];
                    const args = {
                      openTo: OpenType.OPEN_FOLDER,
                      properties,
                    };
                    openDialog(args);
                  }}
                >
                  <span className={classes.menuItemText}>열기</span>
                  <span>Ctrl+O</span>
                </MenuItem>
                {/* TODO : 버튼 활성화/비활성화 상태는 어떻게 구현할 것인지 정하기 */}
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => {
                    console.log('메뉴 클릭');
                  }}
                >
                  <span className={classes.menuItemText}>저장</span>
                  <span>Ctrl+S</span>
                </MenuItem>
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => {
                    console.log(' 메뉴 클릭');
                  }}
                >
                  <span className={classes.menuItemText}>
                    다른 이름으로 저장
                  </span>
                  <span>Shift+Ctrl+S</span>
                </MenuItem>
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => {
                    window.close();
                  }}
                >
                  <span className={classes.menuItemText}>끝내기</span>
                  <span>Ctrl+Q</span>
                </MenuItem>
              </MenuList>
            </Paper>
          )}
        </Popper>
      </ClickAwayListener>
      <Drawer
        anchor="left"
        open
        variant="persistent"
        PaperProps={{
          sx: {
            width: SIDEBAR_WIDTH,
            top: TOP_NAVBAR_HEIGHT,
            height: `calc(100% - ${TOP_NAVBAR_HEIGHT}px)`,
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
};

export default TopologySidebar;
