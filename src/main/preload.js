const { contextBridge, ipcRenderer } = require('electron');

// terraform 명령어 돌려줄 process 띄우기 위한 세팅
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// const util = require('util');
const iconv = require('iconv-lite'); // 리스폰스 data 한글깨짐 없애기 위해 사용한 라이브러리
const path = require('path');
// const { spawn, exec: childExec } = require('child_process');
const { spawn, exec: childExec } = require('child_process');
const index = require('./routes/index');

// MEMO : util.promisify한 exec 사용법 예시를 위해 주석들로 추가해둠
// const exec = util.promisify(childExec);
const childPort = 4001;

const tfRunner = express();
tfRunner.use(index);

const server = http.createServer(tfRunner);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:1212',
    methods: ['GET', 'POST'],
  },
});

// TODO : terraform.exe를 어떻게 찾아서 돌려줄지 정하기
// TODO : Windows cmd 명령어만 구현돼있음. os에 따라 다르게 처리해주는 부분들 추가하기.
io.on('connection', (socket) => {
  socket.on('[REQUEST] Terraform graph', (req) => {
    console.log('[REQUEST]', req);
    const tfPath = req.data;

    // MEMO : 앱구동 시 __dirname으로 어떤 값이 들어오는지 확인용으로 넣은 구문
    const dirPath = path.join(__dirname);
    console.log('__dirname 값 :  ', dirPath);

    // TODO : 지금은 사용자가 입력한 tfPath로 이동해서 거기서 terraform.exe를 돌려주게 돼있으나,
    // 프로젝트 import해서 사용한다면 해당 디렉토리에서 terraform.exe를 돌려주도록 수정해야 함. (terraform.exe파일의 경로는 다른곳에 있다하더라도)
    const command = `cd ${tfPath} && terraform.exe graph`;
    const cmd = spawn(command, { shell: true });

    // MEMO : terraform.exe를 돌릴 디렉토리 path를 chdir 옵션으로 설정할 수 있음. (아래 예시)
    // let cmd = spawn(
    //   'cd src\\main && terraform.exe -chdir=C:\\Users\\SMJ\\Desktop\\tf-init graph',
    //   { shell: true }
    // );

    cmd.stdout.on('data', function (data) {
      socket.emit('[RESPONSE] Terraform graph', {
        data: iconv.decode(data, 'euc-kr'),
      });
    });
    cmd.stderr.on('data', function (data) {
      socket.emit('[RESPONSE] Terraform graph', {
        data: iconv.decode(data, 'euc-kr'),
      });
    });
  });

  socket.on('[REQUEST] Make new folder', (req) => {
    console.log('[REQUEST]', req);
    const fPath = req.data;
    if (!!fPath && fPath !== '' && fPath !== '.') {
      const command = `cd ${fPath} && mkdir newFolder`;
      const cmd = spawn(command, { shell: true });

      cmd.stdout.on('data', function (data) {
        socket.emit('[RESPONSE] Make new folder', {
          data: iconv.decode(data, 'euc-kr'),
        });
      });
      cmd.stdout.on('end', function (data) {
        socket.emit('[RESPONSE] Make new folder', {
          data: `${fPath}에 폴더를 생성했습니다.`,
        });
      });
      cmd.stderr.on('data', function (data) {
        socket.emit('[RESPONSE] Make new folder', {
          data: iconv.decode(data, 'euc-kr'),
        });
      });
    } else {
      socket.emit('[RESPONSE] Make new folder', {
        data: '파일경로를 입력해주세요.',
      });
    }
  });
});

server.listen(childPort, () =>
  console.log(`[INFO] Listening on port ${childPort}`)
);

// Electron ipcRenderer 세팅
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
