import * as _ from 'lodash-es';
import { JSONSchema7 } from 'json-schema';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { hasNotResourceName, getObjectNameInfo } from './getResourceInfo';
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
          const id = hasNotResourceName(resourceType)
            ? resourceType + '-' + instanceName
            : resourceType + '-' + resourceName;
          const currentSchema = terraformSchemaMap.get(id);
          const content = hasNotResourceName(resourceType)
            ? resourceValue
            : Object.values(resourceValue as any)[0];
          const mapObjectTypeList = currentSchema
            ? preDefinedFileObjects(
                resourceType,
                currentSchema as JSONSchema7,
                content,
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
