import { NodeObject, LinkObject } from 'react-force-graph-2d';

export const ROOT = 'root';

export type TerraformNodeKind =
  | 'meta'
  | 'module'
  | 'output'
  | 'provider'
  | 'var';
export type NodeKind = TerraformNodeKind | string;

export interface NodeExtraObject {
  fullName: string;
  simpleName: string;
  type?: NodeKind;
  status?: string;
  modules?: string[];
  parentNodes?: Set<NodeData>;
  childNodes?: Set<NodeData>;
  parentLinks?: Set<LinkData>;
  childLinks?: Set<LinkData>;
}

export type NodeData = NodeObject & NodeExtraObject;

export interface LinkExtraObject {
  id?: string | number;
}

export type LinkData = LinkObject & LinkExtraObject;

export interface ModulePath {
  id?: string | number;
  name: string;
  path: string;
  size?: number;
}
