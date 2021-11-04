import { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';

const supportedSchemaList = ['resource', 'provider'];

const isArray = (currentValue: any) => currentValue.hasOwnProperty('length');

const isResourceType = (type: string) => type === 'resource';

const createFormData = (object: any) => {
  const { type, ...targetObject } = object;
  const name = Object.keys(targetObject)[0];
  const displayName = Object.keys(targetObject[name])[0];

  if (_.isEmpty(object)) {
    return { type, formData: {} };
  }
  const formData = isResourceType(type)
    ? _.cloneDeep(targetObject[name][displayName])
    : _.cloneDeep(targetObject[name]);
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
      if (
        !_.get(jsonSchema, makePath) ||
        _.findIndex(supportedSchemaList, (cur) => cur === type) < 0
      ) {
        fillSchemaByFormData(obj);
        return;
      }
      if (
        _.get(jsonSchema, makePath) &&
        !_.get(jsonSchema, makePath + '.type') &&
        'properties' in _.get(jsonSchema, makePath)
      ) {
        makeFixedSchema(obj[currKey], makePath);
      } else if (_.get(jsonSchema, makePath + '.type') === 'map') {
        setSchema({
          type: 'map',
          items: {
            type: 'string',
          },
        });
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
        makeCustomUISchema(obj[currKey], makeSchemaPath);
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
