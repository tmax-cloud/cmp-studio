import * as React from 'react';
import {
  Box,
  Button,
  Drawer,
  List,
  Typography,
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
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import { dummySchema } from './dummy';

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

interface Item {
  title: string;
  displayName: string;
  type: string;
}

const TopologySidebar: React.FC<TopologySidebarProps> = ({ openSidePanel }) => {
  const classes = useStyles();
  const [items, setItems] = React.useState<Item[]>([]);
  const [prjContextMenuOpen, setPrjContextMenuOpen] = React.useState(false);
  const [prjAnchorEl, setPrjAnchorEl] = React.useState(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const handleTabChange = (event: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const clickAwayHandler = () => {
    setPrjContextMenuOpen(false);
  };

  React.useEffect(() => {
    const itemsList: Item[] = [];
    dummySchema.forEach((i: Item) => {
      itemsList.push({
        title: i.title,
        displayName: i.displayName,
        type: i.type,
      });
    });
    setItems(itemsList);
  }, []);

  const onProjectTabClick = (event: any) => {
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
            label="Project"
            {...a11yProps(0)}
            onMouseDown={onProjectTabClick}
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
                onClick={() => openSidePanel({ id: item.title })}
              >
                {item.displayName}
              </Button>
            );
          })}
        </List>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        구현 예정
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
                    console.log(' 메뉴 클릭');
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
  openSidePanel: any;
};
export default TopologySidebar;
