import { TerraformType, getObjectDataType } from '@renderer/types/terraform';
import * as _ from 'lodash-es';
const KEY_DELIMETER = '**##**';

export const getId = (
  type: TerraformType,
  resourceName: string,
  instanceName: string
) => {
  if (getObjectDataType[type] === 2) {
    return type + '-' + instanceName;
  }
  return type + '-' + resourceName;
};

export const getObjectNameInfo = (object: any, type: string) => {
  return { instanceName: Object.keys(object)[0] };
};
