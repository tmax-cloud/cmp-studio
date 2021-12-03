import { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';
import { getObjectNameInfo } from './getResourceInfo';

const supportedSchemaList = ['resource', 'provider', 'data'];

const isArray = (currentValue: any) => currentValue.hasOwnProperty('length');

const createFormData = (object: any) => {
  if (_.isEmpty(object)) {
    return { type: {}, formData: {} };
  }
  const { type, resourceName, ...targetObject } = object;
  const { instanceName } = getObjectNameInfo(object, type);

  const formData = _.cloneDeep(targetObject[instanceName]);
  return { type, formData };
};

const preDefinedData = (jsonSchema: JSONSchema7, object: any) => {
  const { type, formData } = createFormData(object);
  if (!jsonSchema && _.findIndex(supportedSchemaList, type) >= 0) {
    return { customUISchema: {}, formData: {}, fixedSchema: {} };
  }

  const fixedSchema = {};
  const customUISchema = {};

  const makeFixedSchema = (
    obj: any,
    prevSchemaPath: string,
    prevObjPath: string
  ) => {
    Object.keys(obj).forEach((currKey) => {
      const makeSchemaPath = prevSchemaPath
        ? `${prevSchemaPath}.properties.${currKey}`
        : `properties.${currKey}`;
      const makeObjPath = prevObjPath ? `${prevObjPath}.${currKey}` : currKey;
      const setSchema = (fixedValue: SchemaField) => {
        _.set(fixedSchema, makeSchemaPath, fixedValue);
      };
      const setFormData = (formValue: any) => {
        _.set(formData, makeObjPath, formValue);
      };

      const fillSchemaByFormData = (obj: any) => {
        const currentKey = makeObjPath;
        const currentValue = obj[currentKey];
        if (currentKey) {
          switch (typeof obj[currentKey]) {
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
                const result = _.entries(_.get(formData, makeObjPath)).map(
                  ([key, value]) => {
                    return { [key]: value };
                  }
                );
                console.log(result);
                setFormData(result);
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
      if (!_.get(jsonSchema, makeSchemaPath)) {
        // tf_schema에 정의되지 않은 프로퍼티
        fillSchemaByFormData(obj);
      } else if (
        // type이 object인 경우 -> 재귀
        _.get(jsonSchema, makeSchemaPath) &&
        !_.get(jsonSchema, makeSchemaPath + '.type') &&
        'properties' in _.get(jsonSchema, makeSchemaPath)
      ) {
        if (Array.isArray(obj[currKey])) {
          // type이 object 프로퍼티가 중복 정의 되었을 때 -> array
          _.set(fixedSchema, makeSchemaPath, {
            type: 'array',
            items: _.get(jsonSchema, makeSchemaPath),
          });
          for (let idx = 0; idx < obj[currKey].length; idx++) {
            makeFixedSchema(
              obj[currKey][idx],
              makeSchemaPath + '.items',
              makeObjPath + `[${idx}]`
            );
          }
        } else {
          makeFixedSchema(obj[currKey], makeSchemaPath, makeObjPath);
        }
      } else if (_.get(jsonSchema, makeSchemaPath + '.type') === 'map') {
        // type이 map일 때
        const result = _.entries(_.get(formData, makeObjPath)).map(
          ([key, value]) => {
            return { [key]: value };
          }
        );
        setFormData(result);
        setSchema({
          type: 'map',
          items: {
            type: 'string',
          },
        });
      } else if (
        _.get(jsonSchema, makeSchemaPath + '.type') === 'array' &&
        _.get(jsonSchema, makeSchemaPath + '.items.properties')
      ) {
        _.set(fixedSchema, makeSchemaPath, {
          type: 'array',
          items: _.get(jsonSchema, makeSchemaPath + '.items'),
        });
        if (!Array.isArray(obj[currKey])) {
          makeFixedSchema(
            obj[currKey],
            makeSchemaPath + '.items',
            makeObjPath + '[0]'
          );
          _.set(formData, makeObjPath, [_.get(formData, makeObjPath)]);
        } else {
          for (let idx = 0; idx < obj[currKey].length; idx++) {
            makeFixedSchema(
              obj[currKey][idx],
              makeSchemaPath + '.items',
              makeObjPath + `[${idx}]`
            );
          }
        }
      } else {
        // if (
        //   prevSchemaPath.split('.').pop() === 'items' &&
        //   !_.get(formData, prevObjPath)
        // ) {
        //   _.set(formData, prevObjPath, );
        // }
        _.set(fixedSchema, makeSchemaPath, _.get(jsonSchema, makeSchemaPath));
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

  //   const makeCustomFormData (obj: any, prevPath: string, prevObjPath: string) => {
  //     Object.keys(obj).forEach((currKey) => {

  //       const makeSchemaPath = prevPath
  //         ? `${prevPath}.properties.${currKey}`
  //         : `properties.${currKey}`;
  //         const makeObjPath = prevObjPath
  //           ? `${prevObjPath}.properties.${currKey}`
  //           : `properties.${currKey}`;
  //     })
  //   }

  if (!_.isEmpty(formData)) {
    makeFixedSchema(formData, '', '');
    makeCustomUISchema(formData, '');
    // makeCustomFormData(formData, '');
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
