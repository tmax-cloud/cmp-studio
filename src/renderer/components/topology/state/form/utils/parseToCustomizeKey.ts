import * as _ from 'lodash-es';
import { JSONSchema7 } from 'json-schema';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { getObjectNameInfo, getObjectType } from './getResourceInfo';
import preDefinedFileObjects from './preDefinedFileObjects';

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
          const name =
            getObjectType(resourceType) === 1 ? instanceName : resourceName;
          const id = resourceType + '-' + name;
          const currentSchema = terraformSchemaMap.get(id);
          const content = (type: string) => {
            switch (getObjectType(type)) {
              case 2: {
                return Object.values(resourceValue as any)[0];
              }
              case 1: {
                return resourceValue;
              }
              case 0: {
                return { [resourceName]: resourceValue };
              }
              default:
            }
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
