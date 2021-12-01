import { NodeObject, LinkObject } from 'react-force-graph-2d';
import { TerraformType } from './terraform';

export const ROOT_NAME = 'root';

export interface NodeData extends NodeObject {
  fullName: string; // 'terraform graph' 커맨드를 통해 나온 raw string
  type: TerraformType;
  resourceName?: string;
  instanceName: string;
  icon: IconData;
  modules: string[];
  state?: string;
  parentNodes?: (string | number)[];
  childNodes?: (string | number)[];
}
export interface LinkData extends LinkObject {
  id?: string | number;
}

export interface ModuleData {
  root: boolean; // 프로젝트 루트 경로인지 여부. true면 루트
  id: string | number;
  name: string;
  path: string;
  size: number;
}

export interface IconData {
  width: number;
  height: number;
  path: string;
  translateX?: number;
  translateY?: number;
}
