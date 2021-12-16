import { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';

const specialKey = (props: {
  resourceType: string;
  resourceName: string;
  instanceName: string;
  propertyList: string;
}) => {
  const { resourceType, resourceName, instanceName, propertyList } = props;
  let propertyName;
  if (propertyList.split('.').length >= 0) {
    propertyName = Object.values(propertyList.split('.')).join('**##**');
  }
  if (resourceType === 'terraform') {
    return resourceType + '**##**' + propertyName;
  }
  const resultArr = [resourceType, resourceName, instanceName, propertyName];
  return Object.values(resultArr).join('**##**');
  // return resourceType + '**##**' + resourceName + '**##**' + propertyName;
};

const preDefinedFileObjects = (
  resourceType: string,
  jsonSchema: JSONSchema7 = {},
  object: any,
  resourceName: string,
  instanceName: string
) => {
  const mapObjectTypeList: any[] = [];

  const makeMapObjectTypeList = (
    obj: any,
    prevSchemaPath: string,
    prevObjPath: string
  ) => {
    Object.keys(obj).forEach((currKey) => {
      const makeSchemaPath = prevSchemaPath
        ? `${prevSchemaPath}.properties.${currKey}`
        : `properties.${currKey}`;
      const makeObjPath = prevObjPath
        ? `${prevObjPath}.${currKey}`
        : `${currKey}`;
      const makeSpecialSchemaPath = `${specialKey({
        resourceType,
        resourceName,
        instanceName,
        propertyList: makeObjPath,
      })}`;
      const fillSchemaByFormData = (obj: any) => {
        const currentKey =
          makeObjPath.indexOf('.') >= 0
            ? makeObjPath.split('.')[makeObjPath.split('.').length - 1]
            : makeObjPath;
        const currentValue = _.get(obj, currentKey);

        if (currentKey && typeof currentValue === 'object') {
          if (!Array.isArray(currentValue)) {
            if (makeObjPath === 'required_providers.aws') {
              mapObjectTypeList.push({ [makeSpecialSchemaPath]: 'map' });
            } else {
              mapObjectTypeList.push({ [makeSpecialSchemaPath]: 'object' });
              makeMapObjectTypeList(currentValue, makeSchemaPath, makeObjPath);
            }
          }
        }
      };

      if (!_.get(jsonSchema, makeSchemaPath)) {
        // tf_schema에 정의되지 않은 프로퍼티
        fillSchemaByFormData(obj);
      } else if (
        _.get(jsonSchema, makeSchemaPath) &&
        !_.get(jsonSchema, makeSchemaPath + '.type') &&
        'properties' in _.get(jsonSchema, makeSchemaPath)
      ) {
        if (Array.isArray(obj[currKey])) {
          // type이 object 프로퍼티가 중복 정의 되었을 때 -> array
          for (let idx = 0; idx < obj[currKey].length; idx++) {
            makeMapObjectTypeList(
              obj[currKey][idx],
              makeSchemaPath + '.items',
              makeObjPath + `[${idx}]`
            );
          }
          mapObjectTypeList.push({ [makeSpecialSchemaPath]: 'block' });
        } else {
          makeMapObjectTypeList(obj[currKey], makeSchemaPath, makeObjPath);
          mapObjectTypeList.push({ [makeSpecialSchemaPath]: 'object' });
          // if (prevObjPath) {
          //   mapObjectTypeList.push({ [makeSpecialSchemaPath]: 'block' });
          // }
        }
      } else if (_.get(jsonSchema, makeSchemaPath + '.type') === 'map') {
        // type이 map일 때
        mapObjectTypeList.push({ [makeSpecialSchemaPath]: 'map' });
      } else if (
        _.get(jsonSchema, makeSchemaPath + '.type') === 'array' ||
        _.get(jsonSchema, makeSchemaPath + '.items.properties')
      ) {
        if (!Array.isArray(obj[currKey])) {
          makeMapObjectTypeList(
            obj[currKey],
            makeSchemaPath + '.items',
            makeObjPath + '[0]'
          );
          if (typeof obj[currKey] === 'object') {
            mapObjectTypeList.push({ [makeSpecialSchemaPath]: 'block' });
          }
        } else {
          for (let idx = 0; idx < obj[currKey].length; idx++) {
            makeMapObjectTypeList(
              obj[currKey][idx],
              makeSchemaPath + '.items',
              makeObjPath + `[${idx}]`
            );
          }
          if (typeof obj[currKey][0] === 'object') {
            mapObjectTypeList.push({ [makeSpecialSchemaPath]: 'block' });
          }
        }
      }
    });
  };

  if (!_.isEmpty(object)) {
    makeMapObjectTypeList(object, '', '');
  }
  return mapObjectTypeList;
};

export default preDefinedFileObjects;
