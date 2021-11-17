import { NodeObject, LinkObject } from 'react-force-graph-2d';

export const ROOT_NAME = 'root';

export type TerraformNodeKind = 'module' | 'output' | 'provider' | 'var';
export type NodeKind = TerraformNodeKind | string;

export interface NodeData extends NodeObject {
  fullName: string; // 'terraform graph' 커맨드를 통해 나온 raw string
  simpleName: string;
  type: NodeKind;
  icon: string;
  modules: string[];
  status?: string;
  dataSource?: boolean; // 데이터소스 여부. true면 데이터소스
  parentNodes?: (string | number)[];
  childNodes?: (string | number)[];
}
export interface LinkData extends LinkObject {
  id?: string | number;
}

export interface ModulePath {
  id?: string | number;
  name: string;
  path: string;
  size?: number;
}
