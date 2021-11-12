export type Plan = {
  warnings: Warning[];
  actions: Action[];
};
export enum ChangeType {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Destroy = 'destroy',
  Recreate = 'recreate',
  Unknown = 'unknown',
}
export type ResourceId = {
  name: string;
  type: string;
  prefixes: string[];
};

export type Warning = {
  id: ResourceId;
  detail: string;
};
export type Diff = {
  property: string;
  old?: string;
  new: string;
  forcesNewResource?: boolean;
};

export type Action = {
  id: ResourceId;
  type: ChangeType;
  changes: Diff[];
};
