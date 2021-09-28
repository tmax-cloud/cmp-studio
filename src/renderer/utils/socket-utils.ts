import * as path from 'path';
import { Socket } from 'socket.io-client';

const CHILD_PORT = 4001;
export const SOCKET_ENDPOINT = `http://127.0.0.1:${CHILD_PORT}`;

export function tfGraphTest(socket: Socket, setData: any, tfPath: string) {
  const tfLoc = path.join(tfPath);
  socket.emit('[REQUEST] Terraform graph', { data: tfLoc });

  socket.on('[RESPONSE] Terraform graph', (res) => {
    console.log('[RESPONSE] Terraform graph : ', res);
    // MEMO : data set해주는 부분은 리덕스로 관리돼야 하지 않을까?
    setData(res.data);
  });
}

export function makeFolderTest(socket: Socket, folderPath: string) {
  const fPath = path.join(folderPath);
  socket.emit('[REQUEST] Make new folder', { data: fPath });
}
