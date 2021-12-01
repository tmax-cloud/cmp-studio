import * as React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const TOP_NAVBAR_HEIGHT = 40;

const useStyles = makeStyles({
  root: {
    height: TOP_NAVBAR_HEIGHT,
    minHeight: TOP_NAVBAR_HEIGHT,
    backgroundColor: '#31475E',
  },
});
const MainNavbar: React.FC = (props) => {
  const classes = useStyles();
  return (
    <Box>
      <AppBar elevation={0} position="static" {...props}>
        <Toolbar className={classes.root}>CMP Studio</Toolbar>
      </AppBar>
    </Box>
  );
};

export default MainNavbar;
