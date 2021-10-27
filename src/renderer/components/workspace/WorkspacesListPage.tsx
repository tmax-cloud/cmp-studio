import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled, ThemeProvider } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';
import * as TerraformTypes from '@main/terraform-command/common/terraform';
import {
  TERRAFORM_EXE_PATH_KEY,
  ConfigResponse,
  ConfigStatusType,
} from '@main/configs/common/configuration';
import {
  openExistFolder,
  getRecentlyOpenedWorkspaces,
  getProjectJson,
} from '../../utils/ipc/workspaceIpcUtils';
import { setInitObjects } from '../../features/codeSlice';
import { setWorkspaceUid } from '../../features/commonSlice';
import { maximizeWindowSize } from '../../utils/ipc/windowIpcUtils';
import { getAppConfigItem } from '../../utils/ipc/configIpcUtils';
import { checkTerraformExe } from '../../utils/ipc/terraformIpcUtils';
import WorkspacesList from './WorkspacesList';
import WorkspacesRightSection from './WorkspacesRightSection';
import { WORKSPACE_ROOT_HEIGHT } from './enums';
import { TerraformVersionSettingModal } from '../settings/terraform';
import StudioTheme from '../../theme';

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
  const dispatch = useDispatch();
  const [hasToRefresh, setHasToRefresh] = React.useState(true);
  const [items, setItems] = React.useState<
    WorkspaceTypes.RecentWorkspaceData[]
  >([]);

  const openWorkspace = async (folderUri: string) => {
    const args: WorkspaceTypes.WorkspaceOpenProjectArgs = {
      folderUri,
    };
    const projectJsonRes = await getProjectJson(args);
    dispatch(setInitObjects(projectJsonRes.data));
    openExistFolder(args)
      .then((response: WorkspaceTypes.WorkspaceResponse) => {
        const { status, data } = response;
        if (status === WorkspaceTypes.WorkspaceStatusType.SUCCESS) {
          const uid = (data as WorkspaceTypes.WorkspaceSuccessUidData)?.uid;
          if (uid) {
            history.push(`/main/${uid}`);
            maximizeWindowSize();
            dispatch(setWorkspaceUid(uid));
          }
          return response;
        } else if (
          status === WorkspaceTypes.WorkspaceStatusType.ERROR_NO_PROJECT
        ) {
          console.log('[Error] Cannot find the project :', folderUri);
          return response;
        }
        return response;
      })
      .catch((err: any) => {
        console.log('[Error] Failed to open exists folder :', err);
      });
  };

  React.useEffect(() => {
    if (hasToRefresh) {
      window.electron.ipcRenderer.on(
        'studio:dirPathToOpen',
        (res: Electron.OpenDialogReturnValue) => {
          console.log('dirPathToOpen res?', res);
          const { filePaths, canceled } = res;
          if (!canceled) {
            openWorkspace(filePaths[0]);
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
      .then(async (res: ConfigResponse) => {
        const { status, data } = res;
        if (status === ConfigStatusType.SUCCESS) {
          // TODO : 초반에 terraformPath설정해주는 부분 구현하기
          // TODO : terraform 명령어 사용할 때 에러나도 다시 설정해달라고 모달 띄워야 할듯
          console.log('[INFO] terraform.exe 경로를 설정해주세요.');
          const response: TerraformTypes.TerraformResponse =
            await checkTerraformExe({ terraformExePath: data });
          const { status } = response;
          if (status !== TerraformTypes.TerraformStatusType.SUCCESS) {
            ReactDOM.render(
              <ThemeProvider theme={StudioTheme}>
                <TerraformVersionSettingModal />
              </ThemeProvider>,
              document.getElementById('modal-container')
            );
          }
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
        <WorkspacesList
          items={items}
          setHasToRefresh={setHasToRefresh}
          openWorkspace={openWorkspace}
        />
      </WorkspaceListLeftContainer>
      <WorkspaceListRightContainer>
        <WorkspacesRightSection openWorkspace={openWorkspace} />
      </WorkspaceListRightContainer>
    </WorkspacesLayoutRoot>
  );
};

export default WorkspacesListPage;
