import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import theme from './theme';
import MainLayout from './components/MainLayout';
import {
  tfGraphTest,
  makeFolderTest,
  SOCKET_ENDPOINT,
} from './utils/socket-utils';
// MEMO : boilerplate에 있던 global css 관리해주는 파일인데 현재는 CliTestComponent 보여줄때만 사용중
// import './App.global.css';

const CliTestComponent = () => {
  const [data, setData] = React.useState('여기에 리스폰스가 표시됩니다.');
  const [newFolderPath, setNewFolderPath] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [tfPath, setTfPath] = React.useState('');

  const socket = socketIOClient(SOCKET_ENDPOINT);
  socket.on('[RESPONSE] Make new folder', (res) => {
    setDesc(res.data);
    console.log('[RESPONSE] Make new folder : ', res);
  });
  return (
    <div>
      <div>
        <div id="newfolder-path-label">폴더를 생성할 경로를 입력해주세요.</div>
        <input
          id="newfolder-path"
          type="text"
          value={newFolderPath}
          onChange={(event) => {
            setNewFolderPath(event.target.value);
          }}
          style={{ width: '800px' }}
        />
        <div>{desc}</div>
      </div>
      <div className="CliTestComponent">
        <button
          type="button"
          onClick={() => makeFolderTest(socket, newFolderPath)}
        >
          <span role="img" aria-label="books">
            🍕
          </span>
          Make Folder Test
        </button>
      </div>
      <div>
        <div id="terraform-location-label">
          테라폼 프로젝트 디렉토리 경로를 입력해주세요. (terraform.exe파일이
          있어야 함)
        </div>
        <input
          type="text"
          value={tfPath}
          id="terraform-location"
          onChange={(event) => {
            setTfPath(event.target.value);
          }}
          style={{ width: '800px' }}
        />
      </div>
      <div className="CliTestComponent">
        <button
          type="button"
          onClick={() => tfGraphTest(socket, setData, tfPath)}
        >
          <span role="img" aria-label="books">
            🍟
          </span>
          Terraform graph Test
        </button>
      </div>
      <div
        style={{
          width: '800px',
          height: '300px',
          overflowY: 'auto',
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        {data}
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
            <Route path="/" component={MainLayout} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
