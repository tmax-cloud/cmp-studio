import * as React from 'react';
// import socketIOClient from 'socket.io-client';
import { tfGraphTest } from '../../utils/socket-utils';

const TopologyGraph: React.FC<TopologyGraphProps> = ({ data }) => {
  const [tfPath, setTfPath] = React.useState('');
  const [dg, setDg] = React.useState('');

  const updateGraph = async () => {
    tfGraphTest(setDg, tfPath);
  };
  // TODO : 테라폼 exe위치 입력받는 부분도 초반에 세팅할 수 있도록 구현하고 AppSettings.json 등으로 관리하기
  // TODO : exe로 어떤 위치에서 graph를 실행시켜야 할지 정해야 됨.
  return (
    <>
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
        <button type="button" onClick={updateGraph}>
          Terraform graph Test
        </button>
      </div>
      <div style={{ height: '600px', overflowY: 'auto' }}>{dg}</div>
    </>
  );
};

type TopologyGraphProps = {
  data: any;
};

export default TopologyGraph;
