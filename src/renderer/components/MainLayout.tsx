import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { styled } from '@mui/material';
import { TopologyPage } from './topology/TopologyPage';
import MainNavbar, { TOP_NAVBAR_HEIGHT } from './MainNavbar';

const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const MainLayoutWrapper = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: TOP_NAVBAR_HEIGHT,
});

const MainLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
});

const MainLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
});

export const MainLayout: React.FC<RouteComponentProps<{ uid: string }>> = ({
  match,
}) => {
  const { uid } = match.params;
  console.log('uid? ', uid);
  // TODO : tf파일들에 대해 parser돌려서 object만들어주는 부분 구현하기.
  return (
    <MainLayoutRoot>
      <MainNavbar />
      <MainLayoutWrapper>
        <MainLayoutContainer>
          <MainLayoutContent>
            <TopologyPage />
          </MainLayoutContent>
        </MainLayoutContainer>
      </MainLayoutWrapper>
    </MainLayoutRoot>
  );
};
export default MainLayout;
