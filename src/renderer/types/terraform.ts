export type TerraformType =
  | 'data'
  | 'locals'
  | 'module'
  | 'output'
  | 'provider'
  | 'resource'
  | 'terraform'
  | 'variable';

export const TerraformTypes = [
  'data',
  'locals',
  'module',
  'output',
  'provider',
  'resource',
  'terraform',
  'variable',
];

export const oneDepthDataTypes = ['terraform', 'locals'];
export const twoDepthDataTypes = ['module', 'provider', 'variable', 'output'];
export const threeDepthDataTypes = ['resource', 'data'];

export enum DataDepthType {
  ONE_DEPTH_DATA_TYPE = 'ONE_DEPTH_DATA_TYPE',
  TWO_DEPTH_DATA_TYPE = 'TWO_DEPTH_DATA_TYPE',
  THREE_DEPTH_DATA_TYPE = 'THREE_DEPTH_DATA_TYPE',
}

export const getObjectDataType = {
  terraform: DataDepthType.ONE_DEPTH_DATA_TYPE,
  locals: DataDepthType.ONE_DEPTH_DATA_TYPE,
  module: DataDepthType.TWO_DEPTH_DATA_TYPE,
  provider: DataDepthType.TWO_DEPTH_DATA_TYPE,
  variable: DataDepthType.TWO_DEPTH_DATA_TYPE,
  output: DataDepthType.TWO_DEPTH_DATA_TYPE,
  resource: DataDepthType.THREE_DEPTH_DATA_TYPE,
  data: DataDepthType.THREE_DEPTH_DATA_TYPE,
};

export const isTerraformType = (type: string) =>
  !!TerraformTypes.find((t) => type === t);

export const getId = (
  type: TerraformType,
  resourceName: string,
  instanceName: string
) => {
  if (getObjectDataType[type] === 'TWO_DEPTH_DATA_TYPE') {
    return type + '-' + instanceName;
  }
  return type + '-' + resourceName;
};

export enum TerraformCommandResponseStatusType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
}

export type TerraformCommandResponseStatus =
  | TerraformCommandResponseStatusType.SUCCESS
  | TerraformCommandResponseStatusType.ERROR
  | TerraformCommandResponseStatusType.LOADING;
