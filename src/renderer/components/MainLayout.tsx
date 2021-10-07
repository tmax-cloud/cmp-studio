import * as React from 'react';
import { styled } from '@mui/material';
import { TopologyPage } from './topology/TopologyPage';
import MainNavbar from './MainNavbar';

const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
  flexDirection: 'column',
}));

export const MainLayout = () => (
  <MainLayoutRoot>
    <MainNavbar />
    <TopologyPage />
  </MainLayoutRoot>
);

export default MainLayout;
