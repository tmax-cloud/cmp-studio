import * as React from 'react';
import { styled } from '@mui/material';
import { useHistory } from 'react-router-dom';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';
import {
  TERRAFORM_EXE_PATH_KEY,
  ConfigResponse,
  ConfigStatusType,
} from '@main/configs/common/configuration';
import {
  openExistFolder,
  getRecentlyOpenedWorkspaces,
} from '../../utils/ipc/workspaceIpcUtils';
import { maximizeWindowSize } from '../../utils/ipc/windowIpcUtils';
import { getAppConfigItem } from '../../utils/ipc/configIpcUtils';
import WorkspacesList from './WorkspacesList';
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
  const [hasToRefresh, setHasToRefresh] = React.useState(true);
  const [items, setItems] = React.useState<
    WorkspaceTypes.RecentWorkspaceData[]
  >([]);

  React.useEffect(() => {
    if (hasToRefresh) {
      window.electron.ipcRenderer.on(
        'studio:dirPathToOpen',
        (res: Electron.OpenDialogReturnValue) => {
          console.log('res?', res);
          const { filePaths, canceled } = res;
          if (!canceled) {
            const args: WorkspaceTypes.WorkspaceOpenProjectArgs = {
              folderUri: filePaths[0],
            };
            openExistFolder(args)
              .then((response: WorkspaceTypes.WorkspaceResponse) => {
                console.log('Res? ', response);
                const { data } = response;
                const uid = (data as WorkspaceTypes.WorkspaceSuccessUidData)
                  ?.uid;
                if (uid) {
                  history.push(`/main/${uid}`);
                  maximizeWindowSize();
                }
                return response;
              })
              .catch((err: any) => {
                console.log('[Error] Failed to open exists folder : ', err);
              });
          }
        }
      );

      getRecentlyOpenedWorkspaces()
        .then((res: WorkspaceTypes.WorkspaceResponse) => {
          const { status, data } = res;
          if (status === WorkspaceTypes.WorkspaceStatusType.SUCCESS) {
            const pinnedList: WorkspaceTypes.RecentWorkspaceData[] = [];
            const workspacesList: WorkspaceTypes.RecentWorkspaceData[] = [];
            (
              data as WorkspaceTypes.RecentWorkspacesDataArray
            )?.entries?.forEach((entry) => {
              entry.isPinned
                ? pinnedList.push(entry)
                : workspacesList.push(entry);
            });
            setItems([...pinnedList.reverse(), ...workspacesList.reverse()]);
          } else if (status === WorkspaceTypes.WorkspaceStatusType.ERROR) {
            console.log(
              '[Error] Failed to get recently opened workspaces list : ',
              (data as WorkspaceTypes.WorkspaceErrorData).message
            );
          }
          return status;
        })
        .catch((err: any) => {
          console.log('[Error] Failed to get workspaces history : ', err);
        });
      setHasToRefresh(false);
    }
  }, [history, hasToRefresh]);

  React.useEffect(() => {
    getAppConfigItem({
      key: TERRAFORM_EXE_PATH_KEY,
    })
      .then((res: ConfigResponse) => {
        const { status, data } = res;
        if (status === ConfigStatusType.SUCCESS && data === 'EMPTY') {
          // TODO : 초반에 terraformPath설정해주는 부분 구현하기
          // TODO : terraform 명령어 사용할 때 에러나도 다시 설정해달라고 모달 띄워야 할듯
          console.log('[INFO] terraform.exe 경로를 설정해주세요.');
        }
        return res;
      })
      .catch((e: any) => {
        console.log(e);
      });
  }, []);

  return (
    <WorkspacesLayoutRoot>
      <WorkspaceListLeftContainer>
        <WorkspacesList items={items} setHasToRefresh={setHasToRefresh} />
      </WorkspaceListLeftContainer>
      <WorkspaceListRightContainer>
        <WorkspacesRightSection />
      </WorkspaceListRightContainer>
    </WorkspacesLayoutRoot>
  );
};

export default WorkspacesListPage;
