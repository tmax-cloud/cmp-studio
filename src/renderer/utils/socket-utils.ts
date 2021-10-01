import * as path from 'path';
import socketIOClient from 'socket.io-client';

const CHILD_PORT = 4001;
export const SOCKET_ENDPOINT = `http://127.0.0.1:${CHILD_PORT}`;

// TODO : socket을 어떤식으로 관리하는게 가장 효율적이고 좋을까? SocketContext를 만들어야 되나?
export const socket = socketIOClient(SOCKET_ENDPOINT);

// TODO : socket.emit 등을 사용하는 부분을 이렇게 api로 만들어놓고 setter를 넘겨줘서 사용하는게 좋을지,
// 각 컴포넌트나 코드에서 각자 socket.emit, socket.on으로 사용하는게 좋을지도 정해야 됨.
export function tfGraphTest(setData: any, tfPath: string) {
  const tfLoc = path.join(tfPath);
  socket.emit('[REQUEST] Terraform graph', { data: tfLoc });

  socket.on('[RESPONSE] Terraform graph', (res) => {
    console.log('[RESPONSE] Terraform graph : ', res);
    // MEMO : data set해주는 부분은 리덕스로 관리돼야 하지 않을까?
    setData(res.data);
  });
}

export function makeFolderTest(folderPath: string) {
  const fPath = path.join(folderPath);
  socket.emit('[REQUEST] Make new folder', { data: fPath });
}
