import * as React from 'react';
import { styled } from '@mui/material';
import { useHistory } from 'react-router-dom';
import WorkspacesList, { WorkspaceItemProps } from './WorkspacesList';
import WorkspacesRightSection from './WorkspacesRightSection';
import { WORKSPACE_ROOT_HEIGHT } from './enums';

// TODO : 우클릭 시 나오는 목록고정 팝업 구현하기
// TODO : 앱버전 연동하기
const WorkspacesLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
  minHeight: WORKSPACE_ROOT_HEIGHT,
}));

const WorkspaceListLeftContainer = styled('div')({
  flex: '1',
  height: '100%',
});

const WorkspaceListRightContainer = styled('div')({
  flex: '1',
  height: '100%',
});

const WorkspacesListPage: React.FC = (props) => {
  const history = useHistory();
  const [items, setItems] = React.useState<WorkspaceItemProps[]>([]);

  React.useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:dirSelectionResponse',
      (res: { canceled: boolean; filePaths: string[] }) => {
        console.log('res?', res);
        const { filePaths, canceled } = res;
        if (!canceled) {
          window.electron.ipcRenderer
            .invoke('studio:openExistFolder', { folderUri: filePaths[0] })
            .then((response: any) => {
              console.log('Res? ', response);
              const uid = response?.data?.uid;
              if (uid) {
                history.push(`/main/${uid}`);
                window.electron.ipcRenderer.send('studio:maximizeWindowSize');
              }
              return response;
            })
            .catch((err: any) => {
              console.log('[Error] Failed to open exists folder : ', err);
            });
        }
      }
    );

    window.electron.ipcRenderer
      .invoke('studio:getRecentlyOpenedWorkspaces')
      .then(
        (res: {
          status: 'Success' | 'Error';
          data: {
            entries: {
              folderUri: string;
              labelTitle: string;
              labelUri: string;
              lastOpenedTime: number;
              isPinned: boolean;
              workspaceUid: string;
            }[];
          };
        }) => {
          const { status, data } = res;
          if (status === 'Success') {
            const pinnedList: WorkspaceItemProps[] = [];
            const workspacesList: WorkspaceItemProps[] = [];
            data?.entries?.forEach((entry) => {
              entry.isPinned
                ? pinnedList.push(entry)
                : workspacesList.push(entry);
            });
            setItems([...pinnedList.reverse(), ...workspacesList.reverse()]);
          } else if (status === 'Error') {
            console.log(
              '[Error] Failed to get recently opened workspaces list.'
            );
          }
          return status;
        }
      )
      .catch((err: any) => {
        console.log('[Error] Failed to get workspaces history : ', err);
      });
  }, [history]);
  return (
    <WorkspacesLayoutRoot>
      <WorkspaceListLeftContainer>
        <WorkspacesList items={items} />
      </WorkspaceListLeftContainer>
      <WorkspaceListRightContainer>
        <WorkspacesRightSection />
      </WorkspaceListRightContainer>
    </WorkspacesLayoutRoot>
  );
};

export default WorkspacesListPage;
