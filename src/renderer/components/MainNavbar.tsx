import * as React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const TOP_NAVBAR_HEIGHT = 40;

const useStyles = makeStyles({
  root: {
    height: TOP_NAVBAR_HEIGHT,
    minHeight: TOP_NAVBAR_HEIGHT,
  },
});
const MainNavbar: React.FC = (props) => {
  const classes = useStyles();
  return (
    <AppBar elevation={0} {...props}>
      <Toolbar className={classes.root}>CMP Studio</Toolbar>
    </AppBar>
  );
};

export default MainNavbar;
