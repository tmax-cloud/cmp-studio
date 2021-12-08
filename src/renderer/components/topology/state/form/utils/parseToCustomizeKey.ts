import { TerraformType, getObjectDataType } from '@renderer/types/terraform';
import * as _ from 'lodash-es';
import { JSONSchema7 } from 'json-schema';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { getObjectNameInfo, getId } from './getResourceInfo';
import preDefinedFileObjects from './preDefinedFileObjects';

const getContent = (type: TerraformType, object: any, resourceValue: any) => {
  switch (getObjectDataType[type]) {
    case 3: {
      return Object.values(resourceValue)[0];
    }
    case 2: {
      return resourceValue;
    }
    case 1: {
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
        const { instanceName } = getObjectNameInfo(resourceValue, resourceType);
        const id = getId(
          resourceType as TerraformType,
          resourceName,
          instanceName
        );
        const currentSchema = terraformSchemaMap.get(id);
        const content = (type: string) => {
          return getContent(type as TerraformType, resource, resourceValue);
        };
        const mapObjectTypeList = currentSchema
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
