import * as _ from 'lodash-es';
import { JSONSchema7 } from 'json-schema';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { noResourceNameTypeList } from './getResourceInfo';
import preDefinedFileObjects from './preDefinedFileObjects';

const parseToCustomizeKey = (fileObjects: any[]) => {
  const terraformSchemaMap = getSchemaMap();
  const mapObjectTypeCollection = {};
  return {
    mapObjectTypeCollection,
    data: fileObjects.map((fileObject: any) => {
      let result: any = {};
      _.toPairs(fileObject.fileJson).forEach(
        ([resourceType, resource]: [string, any]) => {
          _.toPairs(resource).forEach(([resourceName, resourceValue]) => {
            const id =
              (resourceType === 'data' ? 'datasource' : resourceType) +
              '-' +
              resourceName;
            const currentSchema = terraformSchemaMap.get(id);
            const hasNoResourceName = !!noResourceNameTypeList.find(
              (currType) => resourceType === currType
            );
            const content = hasNoResourceName
              ? resourceValue
              : Object.values(resourceValue as any)[0];

            // 여기서 preDefiendData 해서 애초에 redux로 갖고있고 sidepanel에서도 그거 참조해서 하는게 좋을듯
            const { mapObjectTypeList = [], customizedObject = {} } =
              preDefinedFileObjects(
                resourceType,
                currentSchema as JSONSchema7,
                content,
                resourceName,
                Object.keys(resourceValue as any)[0]
              );

            Object.values(mapObjectTypeList).forEach((value) => {
              _.assign(mapObjectTypeCollection, value);
            });

            if (!!resourceName) {
              result = {
                fileJson: {
                  ...result.fileJson,
                  [resourceType]: {
                    [resourceName]: {
                      [Object.keys(resourceValue as any)[0]]: customizedObject,
                    },
                  },
                },
              };
            } else {
              result = {
                ...result,
                fileJson: {
                  ...result.fileJson,
                  [resourceType]: {
                    [Object.keys(resourceValue as any)[0]]: customizedObject,
                  },
                },
              };
            }
          });
        }
      );
      return { ...result, filePath: fileObject.filePath };
    }),
  };
};

export default parseToCustomizeKey;
