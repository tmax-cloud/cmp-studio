import { NodeObject, LinkObject } from 'react-force-graph-2d';

export const ROOT = 'root';

export type TerraformNodeKind = 'module' | 'output' | 'provider' | 'var';
export type NodeKind = TerraformNodeKind | string;

export interface NodeData extends NodeObject {
  fullName: string;
  simpleName: string;
  type?: NodeKind;
  status?: string;
  modules?: string[];
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
