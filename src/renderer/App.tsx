import React from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import theme from './theme';
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

  const getGraph = async () => {
    const response = await window.electron.ipcRenderer.invoke(
      'studio:getTerraformGraph',
      { workspaceUid }
    );
    if (response.status === 'Error') {
      setData(response.data.message);
    } else if (response.status === 'Success') {
      setData(response.data.graph);
    }
  };

  return (
    <div>
      <div>
        <div className="TestComponentBlock">
          <div id="workspace-uid-label">
            워크스페이스 id를 입력해주세요.(워크스페이스 메타 workspace.json에
            terraformExePath값 있어야 함)
          </div>
          <input
            type="text"
            value={workspaceUid}
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
            window.electron.ipcRenderer.send('studio:setAppConfigItem', {
              key: 'test1',
              data: 'hello',
            });
            window.electron.ipcRenderer.send('studio:setAppConfigItems', {
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

            const item = await window.electron.ipcRenderer.invoke(
              'studio:getAppConfigItem',
              { key: 'test1' }
            );
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
          onChange={(event) => {
            setFolderPathToCreate(event.target.value);
          }}
          style={{ width: '800px' }}
        />
        <input
          type="text"
          value={workspaceNameToCreate}
          id="new-project-name"
          onChange={(event) => {
            setWorkspaceNameToCreate(event.target.value);
          }}
          style={{ width: '800px' }}
        />
        <button
          type="button"
          onClick={async () => {
            const response = await window.electron.ipcRenderer.invoke(
              'studio:createNewFolderAndWorkspace',
              {
                folderUri: folderPathToCreate,
                workspaceName: workspaceNameToCreate,
              }
            );
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
          onChange={(event) => {
            setFolderToOpen(event.target.value);
          }}
          style={{ width: '800px' }}
        />
        <button
          type="button"
          onClick={async () => {
            const response = await window.electron.ipcRenderer.invoke(
              'studio:openExistFolder',
              { folderUri: folderToOpen }
            );
            console.log('Response? ', response);

            // window.electron.ipcRenderer.send('studio:setWindowSize', {width: 150, height: 50})
          }}
        >
          Open folder test (console log 확인)
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
            <Route path="/main/:uid" exact component={MainLayout} />{' '}
            <Route render={() => <Redirect to="/home" />} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
