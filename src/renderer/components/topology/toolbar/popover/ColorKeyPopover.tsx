import * as React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popover,
  Typography,
} from '@mui/material';

const ColorKeyPopover = (props: ColorKeyPopoverProps) => {
  const { anchorEl, setAnchorEl } = props;

  const open = Boolean(anchorEl);

  const colorList = [
    {
      name: '프로바이더',
      color: 'rgb(255, 87, 134)',
    },
    {
      name: '리소스',
      color: 'rgb(0, 183, 189)',
    },
    {
      name: '데이터소스',
      color: 'rgb(144, 157, 255)',
    },
    {
      name: '모듈',
      color: 'rgb(255, 173, 48)',
    },
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Paper
        sx={{
          width: 160,
          height: 160,
          p: 2,
        }}
      >
        <Typography variant="h5" noWrap component="div" sx={{ mb: 1 }}>
          Color Key
        </Typography>
        <List disablePadding>
          {colorList.map((item) => {
            return (
              <ListItem key={item.name} disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderWidth: 10, borderColor: item.color }}
                  />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Popover>
  );
};

interface ColorKeyPopoverProps {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: any;
}

export default ColorKeyPopover;
