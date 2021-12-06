import * as _ from 'lodash-es';
import { JSONSchema7 } from 'json-schema';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { getObjectNameInfo, getObjectType, getId } from './getResourceInfo';
import preDefinedFileObjects from './preDefinedFileObjects';

const getContent = (type: string, object: any) => {
  switch (getObjectType(type)) {
    case 2: {
      return Object.values(Object.values(object as any)[0] as any)[0];
    }
    case 1: {
      return Object.values(object as any)[0];
    }
    case 0: {
      return object;
    }
    default:
  }
};

const parseToCustomizeKey = (fileObjects: any[]) => {
  const terraformSchemaMap = getSchemaMap();
  const mapObjectTypeCollection = {};

  fileObjects.forEach((fileObject: any) => {
    _.toPairs(fileObject.fileJson).forEach(
      ([resourceType, resource]: [string, any]) => {
        _.toPairs(resource).forEach(([resourceName, resourceValue]) => {
          const { instanceName } = getObjectNameInfo(
            resourceValue,
            resourceType
          );
          const id = getId(resourceType, resourceName, instanceName);
          const currentSchema = terraformSchemaMap.get(id);
          const content = (type: string) => {
            getContent(type, resource);
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
      }
    );
  });

  return {
    data: fileObjects,
    mapObjectTypeCollection,
  };
};

export default parseToCustomizeKey;
