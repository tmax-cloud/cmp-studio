import * as React from 'react';
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
} from '@mui/material';
import { AcUnit, FilterVintage, Storage, Circle } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { OptionProperties, OpenType } from '@main/dialog/common/dialog';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';
import { RootState } from '@renderer/app/store';
import {
  openExistFolder,
  getProjectJson,
} from '../../utils/ipc/workspaceIpcUtils';
import { openDialog } from '../../utils/ipc/dialogIpcUtils';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import TopologyLibrary from './TopologyLibrary';
import {
  setSelectedObjectInfo,
  setInitObjects,
} from '../../features/codeSlice';
import { setWorkspaceUid } from '../../features/commonSlice';

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
  displayName: string;
  type: string;
}

const TopologySidebar: React.FC<TopologySidebarProps> = (props) => {
  const { setIsSidePanelOpen } = props;
  const classes = useStyles();
  const history = useHistory();
  const [items, setItems] = React.useState<Item[]>([]);
  const [prjContextMenuOpen, setPrjContextMenuOpen] = React.useState(false);
  const [prjAnchorEl, setPrjAnchorEl] = React.useState(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const dispatch = useDispatch();
  const handleTabChange = (event: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const clickAwayHandler = () => {
    setPrjContextMenuOpen(false);
  };

  const selectObjects = createSelector(
    (state: RootState) => state.code.objects,
    (objects: WorkspaceTypes.TerraformFileJsonMeta[]) => {
      return objects;
    }
  );

  const objResult: any[] = [];

  // useSelector로 반환한 배열에 대해 반복문을 돌면서 objResult를 변경시킴... refactor할 예정
  useSelector(selectObjects).forEach(
    (file: { filePath: string; fileJson: any[] }) => {
      objResult.push(
        ..._.entries(file.fileJson).map((object) => ({
          [object[0]]: object[1],
        }))
      );
    }
  );

  React.useEffect(() => {
    const itemsList: Item[] = [];
    objResult
      .map((result) => {
        const type = Object.keys(result)[0];
        const displayName = Object.keys(result[type])[0];
        const title = type + '-' + displayName;
        return { type, displayName, title };
      })
      .forEach((i: Item) => {
        itemsList.push({
          provider: i.displayName.split('_')[0],
          title: i.title,
          displayName: i.displayName,
          type: i.type,
        });
      });
    setItems(itemsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname]);

  React.useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:dirPathToOpen',
      (res: { canceled: boolean; filePaths: string[] }) => {
        const { filePaths, canceled } = res;
        const args: WorkspaceTypes.WorkspaceOpenProjectArgs = {
          folderUri: filePaths[0],
        };
        if (!canceled) {
          openExistFolder(args)
            .then(async (response: any) => {
              const uid = response?.data?.uid;
              if (uid) {
                const projectJsonRes = await getProjectJson(args);
                dispatch(setInitObjects(projectJsonRes.data));
                history.push(`/main/${uid}`);
                dispatch(setWorkspaceUid(uid));
              }
              return response;
            })
            .catch((err: any) => {
              console.log('[Error] Failed to open exist folder : ', err);
            });
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
                    const type = Object.keys(cur)[0];
                    const name = Object.keys(cur[type])[0];
                    if (item.title === type + '-' + name) {
                      return cur;
                    }
                  });
                  const object = {
                    id: item.title,
                    content: content[0],
                  };

                  dispatch(setSelectedObjectInfo(object));
                  setIsSidePanelOpen((currState: boolean) => !currState);
                }}
              >
                {item.displayName}
              </Button>
            );
          })}
        </List>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <TopologyLibrary items={items} />
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
                    console.log(' 메뉴 클릭');
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
type TopologySidebarProps = {
  setIsSidePanelOpen: any;
};

export default TopologySidebar;
