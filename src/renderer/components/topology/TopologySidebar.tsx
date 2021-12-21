import * as React from 'react';
import * as ReactDOM from 'react-dom';
import _ from 'lodash';
import {
  Box,
  Drawer,
  Tabs,
  Tab,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  ThemeProvider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { OptionProperties, OpenType } from '@main/dialog/common/dialog';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';
import { selectCodeFileObjects } from '@renderer/features/codeSliceInputSelectors';
import { setSidePanel } from '@renderer/features/uiSlice';
import { TerraformType, getObjectDataType } from '@renderer/types/terraform';
import parseToCustomizeKey from './state/form/utils/parseToCustomizeKey';

import {
  openExistFolder,
  getProjectJson,
} from '../../utils/ipc/workspaceIpcUtils';
import { openDialog } from '../../utils/ipc/dialogIpcUtils';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import TopologyLibrary from './library/TopologyLibrary';
import {
  setFileObjects,
  setMapObjectTypeCollection,
} from '../../features/codeSlice';

import { setWorkspaceUid } from '../../features/commonSlice';
import CreateWorkspaceModal from '../workspace/CreateWorkspaceModal';
import StudioTheme from '../../theme';
import { TopologyObject } from './object';
import { Data } from './object/TopologyObjectTable';

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

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ height: 'inherit', overflow: 'auto', p: 2 }}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
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

const TopologySidebar = () => {
  const classes = useStyles();
  const history = useHistory();
  const [items, setItems] = React.useState<Data[]>([]);
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
          const { data, mapObjectTypeCollection } = parseToCustomizeKey(
            projectJsonRes.data
          );
          dispatch(setSidePanel(false));
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
  // [TODO] Error나서 string으로 들어올 때 Error 표시 기획 필요할듯

  const setObjResult = (file: any, type: TerraformType) => {
    switch (getObjectDataType[type]) {
      case 'THREE_DEPTH_DATA_TYPE': {
        Object.keys(file.fileJson[type]).forEach((resourceName) => {
          objResult.push(
            ..._.entries(file.fileJson[type][resourceName]).map((object) => {
              return {
                [object[0]]: object[1],
                type,
                resourceName,
                instanceName: object[0],
              };
            })
          );
        });
        break;
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        objResult.push(
          ..._.entries(file.fileJson[type]).map((object) => {
            return {
              [object[0]]: object[1],
              type,
              resourceName: '',
              instanceName: object[0],
            };
          })
        );
        break;
      }
      case 'ONE_DEPTH_DATA_TYPE': {
        objResult.push(
          ..._.entries(file.fileJson).map((object) => ({
            [object[0]]: object[1],
            type,
            resourceName: '',
            instanceName: '',
          }))
        );
        break;
      }
      default:
    }
  };

  Array.isArray(fileObjects) &&
    fileObjects.forEach((file: { filePath: string; fileJson: any }) => {
      // eslint-disable-next-line guard-for-in
      for (const type in file.fileJson) {
        setObjResult(file, type as TerraformType);
      }
    });

  React.useEffect(() => {
    const itemsList: Data[] = [];
    objResult
      .filter((result) => {
        const { type, resourceName, ...object } = result;
        const instanceName = Object.keys(object)[0];
        return !!instanceName;
      })
      .map((result) => {
        const { type, resourceName, ...object } = result;
        const instanceName = Object.keys(object)[0];
        return { type, resourceName, instanceName };
      })
      .forEach((i: Data) => {
        itemsList.push({
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
    <Box sx={{ width: '100%', height: 'inherit' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab
            className={classes.tab}
            label="오브젝트"
            {...a11yProps(0)}
            onMouseDown={onObjectTabClick}
          />
          <Tab className={classes.tab} label="라이브러리" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <TopologyObject items={items} objResult={objResult} />
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
            overflow: 'hidden',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
};

export default TopologySidebar;
