import { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';

const isArray = (currentValue: any) => currentValue.hasOwnProperty('length');

const createFormData = (object: any) => {
  const type = Object.keys(object)[0];
  const name = Object.keys(object[type])[0];
  const displayName = Object.keys(object[type][name])[0];
  const formData =
    (!_.isEmpty(object) && _.cloneDeep(object[type][name][displayName])) || {};
  return formData;
};

const preDefinedData = (jsonSchema: JSONSchema7, object: any) => {
  if (!jsonSchema) {
    return { customUISchema: {}, formData: {}, fixedSchema: {} };
  }
  const formData = createFormData(object);

  const fixedSchema = {};
  const customUISchema = {};

  // formData로 정의된 부분에 대해서만 schema 필터링 (일단 aws_acm_certificate_validation 리소스에 대해서만 해놓음. 다른 스키마들은 밑에 로직 안타서 전체스키마 나오도록 해둠.)
  const makeFixedSchema = (obj: any, prevPath: string) => {
    Object.keys(obj).forEach((currKey) => {
      const makePath = prevPath
        ? `${prevPath}.properties.${currKey}`
        : `properties.${currKey}`;

      const setSchema = (fixedValue: SchemaField) => {
        _.set(fixedSchema, makePath, fixedValue);
      };

      const addAdditionalSchema = (obj: any) => {
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
            default:
          }
        }
      };

      if (!_.get(jsonSchema, makePath)) {
        addAdditionalSchema(obj);
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
