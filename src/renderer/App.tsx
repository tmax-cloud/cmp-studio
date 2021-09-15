import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import socketIOClient, { Socket } from 'socket.io-client';
import * as path from 'path';
import './App.global.css';

const ENDPOINT = 'http://127.0.0.1:4001';

function emitTest(socket: Socket, setData: any, tfPath: string) {
  const tfLoc = path.join(tfPath);
  socket.emit('[REQUEST] Terraform graph', { data: tfLoc });

  socket.on('[RESPONSE] Terraform graph', (res) => {
    console.log('[RESPONSE] Terraform graph : ', res);
    setData(res.data);
  });
}

function makeFolderTest(socket: Socket, folderPath: string) {
  const fPath = path.join(folderPath);
  socket.emit('[REQUEST] Make new folder', { data: fPath });
}

const Hello = () => {
  const [data, setData] = React.useState('여기에 리스폰스가 표시됩니다.');
  const [newFolderPath, setNewFolderPath] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [tfPath, setTfPath] = React.useState('');

  const socket = socketIOClient(ENDPOINT);
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
      <div className="Hello">
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
      <div className="Hello">
        <button type="button" onClick={() => emitTest(socket, setData, tfPath)}>
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
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
