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

export const MainLayout = () => {
  // TODO : tf파일들에 대해 parser돌려서 object만들어주는 부분 구현하기.
  return (
    <MainLayoutRoot>
      <MainNavbar />
      <TopologyPage />
    </MainLayoutRoot>
  );
};

export default MainLayout;
