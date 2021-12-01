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

export const isTerraformType = (type: string) =>
  !!TerraformTypes.find((t) => type === t);
