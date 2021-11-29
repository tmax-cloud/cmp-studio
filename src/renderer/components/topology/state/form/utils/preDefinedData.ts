import { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';
import { getObjectNameInfo } from './getResourceInfo';

const supportedSchemaList = ['resource', 'provider', 'data'];

const isArray = (currentValue: any) => currentValue.hasOwnProperty('length');

const isResourceType = (type: string) => type === 'resource';

const createFormData = (object: any) => {
  const { type, ...targetObject } = object;
  // const resourceName = Object.keys(targetObject)[0];
  // const instanceName = Object.keys(targetObject[resourceName])[0];
  const { resourceName, instanceName } = getObjectNameInfo(object, type);

  if (_.isEmpty(object)) {
    return { type, formData: {} };
  }
  const formData = resourceName
    ? _.cloneDeep(targetObject[resourceName][instanceName])
    : _.cloneDeep(targetObject[resourceName]);
  return { type, formData };
};

const preDefinedData = (jsonSchema: JSONSchema7, object: any) => {
  const { type, formData } = createFormData(object);
  if (!jsonSchema && _.findIndex(supportedSchemaList, type) >= 0) {
    return { customUISchema: {}, formData: {}, fixedSchema: {} };
  }

  const fixedSchema = {};
  const customUISchema = {};

  const makeFixedSchema = (obj: any, prevPath: string) => {
    Object.keys(obj).forEach((currKey) => {
      const makePath = prevPath
        ? `${prevPath}.properties.${currKey}`
        : `properties.${currKey}`;

      const setSchema = (fixedValue: SchemaField) => {
        _.set(fixedSchema, makePath, fixedValue);
      };

      const fillSchemaByFormData = (obj: any) => {
        const currentKey = makePath.split('properties.');
        const currentValue = obj[currentKey[1]];
        if (currentKey.length > 1) {
          switch (typeof obj[currentKey[1]]) {
            case 'string': {
              setSchema({ type: 'string' });
              break;
            }
            case 'boolean': {
              setSchema({ type: 'boolean' });
              break;
            }
            // [TODO]: 사용자가 terraform schema에 없는 프로퍼티를 tf파일에 직접 정의할 경우에 대한 case 추가 필요
            // => cmp-studio에서는 map형식의 object만 추가하는 기능만 제공하긴 함.
            case 'object': {
              if (isArray(currentValue)) {
                setSchema({
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                });
              } else {
                setSchema({
                  type: 'map',
                  items: {
                    type: 'string',
                  },
                });
              }
              break;
            }
            case 'number': {
              setSchema({ type: 'string' });
              break;
            }
            default:
          }
        }
      };
      if (!_.get(jsonSchema, makePath)) {
        fillSchemaByFormData(obj);
      } else if (
        _.get(jsonSchema, makePath) &&
        !_.get(jsonSchema, makePath + '.type') &&
        'properties' in _.get(jsonSchema, makePath)
      ) {
        if (Array.isArray(obj[currKey])) {
          for (let idx = 0; idx < obj[currKey].length; idx++) {
            makeFixedSchema(obj[currKey][idx], makePath);
          }
        } else {
          makeFixedSchema(obj[currKey], makePath);
        }
      } else if (_.get(jsonSchema, makePath + '.type') === 'map') {
        setSchema({
          type: 'map',
          items: {
            type: 'string',
          },
        });
      } else if (
        _.get(jsonSchema, makePath + '.type') === 'array' &&
        _.get(jsonSchema, makePath + '.type.items.properties')
      ) {
        makeFixedSchema(obj[currKey], makePath + '.type.items');
      } else {
        _.set(fixedSchema, makePath, _.get(jsonSchema, makePath));
      }
    });
  };
  const makeCustomUISchema = (obj: any, prevPath: string) => {
    Object.keys(obj).forEach((currKey) => {
      const makeSchemaPath = prevPath
        ? `${prevPath}.properties.${currKey}`
        : `properties.${currKey}`;
      const makeUIPath = prevPath ? `${prevPath}.${currKey}` : currKey;

      if (
        !_.get(fixedSchema, makeSchemaPath + '.type') &&
        'properties' in _.get(fixedSchema, makeSchemaPath)
      ) {
        if (Array.isArray(obj[currKey])) {
          for (let idx = 0; idx < obj[currKey].length; idx++) {
            makeCustomUISchema(obj[currKey][idx], makeSchemaPath);
          }
        } else {
          makeCustomUISchema(obj[currKey], makeSchemaPath);
        }
      } else if (_.get(fixedSchema, makeSchemaPath + '.type') === 'map') {
        _.set(customUISchema, makeUIPath, {
          [`ui:field`]: 'MapField',
        });
      }
    });
  };

  if (!_.isEmpty(formData)) {
    makeFixedSchema(formData, '');
    makeCustomUISchema(formData, '');
  }
  return { customUISchema, formData, fixedSchema };
};

type SchemaField = {
  type: string;
  items?: SchemaType;
};
type SchemaType = {
  type: string;
};
export default preDefinedData;
