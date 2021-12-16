import {
  TerraformType,
  getObjectDataType,
  getId,
} from '@renderer/types/terraform';
import * as _ from 'lodash-es';
import { JSONSchema7 } from 'json-schema';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import preDefinedFileObjects from './preDefinedFileObjects';

const getContent = (type: TerraformType, object: any, resourceValue: any) => {
  switch (getObjectDataType[type]) {
    case 'THREE_DEPTH_DATA_TYPE': {
      return Object.values(resourceValue)[0];
    }
    case 'TWO_DEPTH_DATA_TYPE': {
      return resourceValue;
    }
    case 'ONE_DEPTH_DATA_TYPE': {
      return object;
    }
    default:
  }
};

const parseToCustomizeKey = (fileObjects: any[]) => {
  const terraformSchemaMap = getSchemaMap();
  const mapObjectTypeCollection = {};

  fileObjects.forEach((fileObject: any) => {
    _.toPairs(fileObject.fileJson).forEach(([resourceType, resource]) => {
      _.toPairs(resource as any).forEach(([resourceName, resourceValue]) => {
        const instanceName = Object.keys(resourceValue as any)[0];
        const id = getId(
          resourceType as TerraformType,
          resourceName,
          instanceName
        );
        const currentSchema = terraformSchemaMap.get(id);
        const content = (type: string) => {
          return getContent(type as TerraformType, resource, resourceValue);
        };
        const mapObjectTypeList =
          currentSchema || resourceType === 'terraform'
            ? preDefinedFileObjects(
                resourceType,
                currentSchema as JSONSchema7,
                content(resourceType),
                resourceName,
                Object.keys(resourceValue as any)[0]
              )
            : [];

        Object.values(mapObjectTypeList).forEach((value) => {
          _.assign(mapObjectTypeCollection, value);
        });
      });
    });
  });

  return {
    data: fileObjects,
    mapObjectTypeCollection,
  };
};

export default parseToCustomizeKey;
