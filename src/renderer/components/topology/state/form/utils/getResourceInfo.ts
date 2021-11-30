const KEY_DELIMETER = '**##**';

export const noResourceNameTypeList = [
  'module',
  'provider',
  'variable',
  'output',
  'terraform',
  'locals',
];

export const hasNotResourceName = (type: string) =>
  !!noResourceNameTypeList.find((currType) => type === currType);

export const getObjectNameInfo = (object: any, type: string) => {
  return { instanceName: Object.keys(object)[0] };
};

export const getProperKey = (key: string) => {
  if (key.indexOf(KEY_DELIMETER) < 0) {
    return key;
  }
  return key.split(KEY_DELIMETER).pop();
};
