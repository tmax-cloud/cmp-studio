import * as _ from 'lodash-es';
const KEY_DELIMETER = '**##**';

export const noResourceNameTypeList = [
  'module',
  'provider',
  'variable',
  'output',
  'terraform',
  'locals',
];

export const noInstanceNameTypeList = ['terraform', 'locals'];

export const getObjectType = (type: string) => {
  if (_.findIndex(noResourceNameTypeList, (cur) => cur === type) < 0) {
    // resource || datasource
    // resourceName이랑 instanceName 두개 다 있으니까 2 반환
    return 2;
  } else if (
    _.findIndex(
      _.xor(noResourceNameTypeList, noInstanceNameTypeList),
      (cur) => cur === type
    ) >= 0
  ) {
    // module || provider || variable || output
    //  instanceName 하나있으니까 1 반환
    return 1;
  } else if (_.findIndex(noInstanceNameTypeList, (cur) => cur === type) >= 0) {
    // terraform || locals
    // resourceName이랑 instanceName 두개 다 없으니까 0 반환
    return 0;
  }
  return -1; // 해당 사항 없을 때 (error)
};
export const getId = (
  type: string,
  resourceName: string,
  instanceName: string
) => {
  if (getObjectType(type) === 1) {
    return instanceName;
  }
  return resourceName;
};

export const getObjectNameInfo = (object: any, type: string) => {
  return { instanceName: Object.keys(object)[0] };
};

export const getProperKey = (key: string) => {
  if (key.indexOf(KEY_DELIMETER) < 0) {
    return key;
  }
  return key.split(KEY_DELIMETER).pop();
};
