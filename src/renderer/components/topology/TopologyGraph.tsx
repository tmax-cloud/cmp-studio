import * as React from 'react';
/* MJ : 이 파일 PR 머지 되면 제거 예정 */
const TopologyGraph: React.FC<TopologyGraphProps> = ({ data }) => {
  const [tfPath, setTfPath] = React.useState('');
  return (
    <div style={{ padding: '8px' }}>
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
      <div className="TestComponent">
        <button type="button">Terraform graph Test</button>
      </div>
    </div>
  );
};

type TopologyGraphProps = {
  data: any;
};

export default TopologyGraph;
