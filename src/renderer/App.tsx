import React from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';
import theme from './theme';
import {
  TerraformStatusType,
  TerraformErrorData,
  TerraformGraphSuccessData,
  TerraformVersionSuccessData,
  TerraformResponse,
} from '../main/terraform-command/common/terraform';
import {
  getTerraformGraph,
  doTerraformInit,
  getTerraformVersion,
  checkTerraformExe,
} from './utils/ipc/terraformIpcUtils';
import * as WorkspaceIpcUtils from './utils/ipc/workspaceIpcUtils';
import * as ConfigIpcUtils from './utils/ipc/configIpcUtils';
import MainLayout from './components/MainLayout';
import WorkspacesListPage from './components/workspace/WorkspacesListPage';

// MEMO : boilerplate에 있던 global css 관리해주는 파일인데 현재는 TestComponent 보여줄때만 사용중
import './App.global.scss';
declare global {
  interface Window {
    electron?: any;
  }
}
const TestComponent = () => {
  const [data, setData] = React.useState('여기에 리스폰스가 표시됩니다.');
  const [workspaceUid, setWorkspaceUid] = React.useState('');
  const [folderPathToCreate, setFolderPathToCreate] = React.useState('');
  const [workspaceNameToCreate, setWorkspaceNameToCreate] = React.useState('');
  const [folderToOpen, setFolderToOpen] = React.useState('');
  const [folderToConvert, setFolderToConvert] = React.useState('');

  const getGraph = async () => {
    const versionRes = await getTerraformVersion({ workspaceUid });
    console.log(
      'Version? ',
      (versionRes.data as TerraformVersionSuccessData).versionData?.split(
        '\n'
      )[0]
    );

    setData('terraform graph 그래프데이타 가져오는 중입니다..');
    const response = await getTerraformGraph({ workspaceUid });
    if (response.status === TerraformStatusType.ERROR_GRAPH) {
      setData('terraform graph 커맨드에 에러가 있어 init 시도중입니다...');
      const response2 = await doTerraformInit({ workspaceUid });
      if (response2.status === TerraformStatusType.ERROR_INIT) {
        setData(
          'terraform init에 실패했습니다. 에러 내용 :' +
            (response2.data as TerraformErrorData).message
        );
      } else if (response2.status === TerraformStatusType.SUCCESS) {
        setData('init 성공 후 다시 graph가져오는중..');
        const response3 = await getTerraformGraph({ workspaceUid });
        if (response3.status === TerraformStatusType.ERROR_GRAPH) {
          setData(
            'terraform graph 커맨드 실행에 문제가 있습니다. ' +
              (response3.data as TerraformErrorData).message
          );
        } else if (response3.status === TerraformStatusType.SUCCESS) {
          setData((response3.data as TerraformGraphSuccessData).graphData);
        }
      }
    } else if (response.status === TerraformStatusType.SUCCESS) {
      setData((response.data as TerraformGraphSuccessData).graphData);
    }
  };

  return (
    <div>
      <div>
        <div className="TestComponentBlock">
          <div id="workspace-uid-label">
            워크스페이스 id를 입력해주세요.(시스템 환경변수로 테라폼 path
            설정돼있어야 함. terraform 커맨드 실행가능한 상태로)
          </div>
          <input
            type="text"
            value={workspaceUid}
            placeholder="워크스페이스 uid를 입력해주세요."
            id="workspace-uid"
            onChange={(event) => {
              setWorkspaceUid(event.target.value);
            }}
            style={{ width: '800px' }}
          />
          <button type="button" onClick={getGraph}>
            <span role="img" aria-label="books">
              🍟
            </span>
            Terraform graph Test
          </button>
          <div
            style={{
              width: '800px',
              height: '300px',
              overflowY: 'auto',
              backgroundColor: 'white',
              color: 'black',
              margin: 'auto auto',
            }}
          >
            {data}
          </div>
        </div>
      </div>
      <div className="TestComponentBlock">
        <button
          type="button"
          onClick={async () => {
            ConfigIpcUtils.setAppConfigItem({
              key: 'test1',
              data: 'hello',
            });
            ConfigIpcUtils.setAppConfigItems({
              items: [
                {
                  key: 'test1',
                  data: 'hello1',
                },
                { key: 'test2', data: 12 },
                {
                  key: 'test3',
                  data: { my: 'name' },
                },
              ],
            });

            const item = await ConfigIpcUtils.getAppConfigItem({
              key: 'test1',
            });
            console.log('item?? ', item);
          }}
        >
          <span role="img" aria-label="books">
            🍟
          </span>
          App Config File Test (console log 확인)
        </button>
      </div>
      <div className="TestComponentBlock">
        <input
          type="text"
          value={folderPathToCreate}
          id="new-folder-path"
          placeholder="프로젝트 폴더 경로를 입력해주세요."
          onChange={(event) => {
            setFolderPathToCreate(event.target.value);
          }}
          style={{ width: '800px' }}
        />
        <input
          type="text"
          value={workspaceNameToCreate}
          id="new-project-name"
          placeholder="새로 만들 프로젝트 이름를 입력해주세요."
          onChange={(event) => {
            setWorkspaceNameToCreate(event.target.value);
          }}
          style={{ width: '800px' }}
        />
        <button
          type="button"
          onClick={async () => {
            const response =
              await WorkspaceIpcUtils.createNewFolderAndWorkspace({
                folderUri: folderPathToCreate,
                workspaceName: workspaceNameToCreate,
              });
            console.log('Response? ', response);
          }}
        >
          Create new folder and workspace test (console log 확인)
        </button>
      </div>
      <div className="TestComponentBlock">
        <input
          type="text"
          value={folderToOpen}
          id="folder-to-open"
          placeholder="프로젝트 폴더 경로를 입력해주세요."
          onChange={(event) => {
            setFolderToOpen(event.target.value);
          }}
          style={{ width: '800px' }}
        />
        <button
          type="button"
          onClick={async () => {
            const response = await WorkspaceIpcUtils.openExistFolder({
              folderUri: folderToOpen,
            });
            console.log('Response? ', response);
          }}
        >
          Open folder test (console log 확인)
        </button>
      </div>
      <div className="TestComponentBlock">
        <input
          type="text"
          value={folderToConvert}
          placeholder="프로젝트 폴더 경로를 입력해주세요."
          id="folder-to-open"
          onChange={(event) => {
            setFolderToConvert(event.target.value);
          }}
          style={{ width: '800px' }}
        />
        <button
          type="button"
          onClick={async () => {
            const args: WorkspaceTypes.WorkspaceGetProjectJsonArgs = {
              folderUri: folderToConvert,
            };
            const response = await WorkspaceIpcUtils.getProjectJson(args);
            console.log('terraform objects? ', response);
          }}
        >
          Tf to Json Convert test (console log 확인)
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/home" exact component={WorkspacesListPage} />
            <Route path="/main/:uid" exact component={MainLayout} />
            <Route render={() => <Redirect to="/home" />} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
