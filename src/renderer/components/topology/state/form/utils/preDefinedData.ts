import { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';

const supportedSchemaList = ['resource', 'provider', 'data'];

const preDefinedData = (jsonSchema: JSONSchema7, object: any, type: string) => {
  const formData = _.cloneDeep(object);
  if (!jsonSchema && _.findIndex(supportedSchemaList, type) >= 0) {
    return { customUISchema: {}, formData: {}, fixedSchema: {} };
  }

  const fixedSchema = {};
  const customUISchema = {};

  if (jsonSchema) {
    _.set(fixedSchema, 'required', jsonSchema.required);
  }

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

      const fillSchemaByFormData = (obj: any, currentKey: string) => {
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
              if (Array.isArray(currentValue)) {
                // array
                const currObj = currentValue[0];
                setSchema({ type: 'array' });
                if (typeof currObj === 'object') {
                  if (!Array.isArray(currObj)) {
                    // array 안에 object
                    // [TODO] array안에 array일 경우 아직 안함.
                    Object.keys(currObj).forEach((objKey) => {
                      makeFixedSchema(
                        currObj[objKey],
                        makeSchemaPath + '.items.properties.' + objKey,
                        ''
                      );
                    });
                  }
                } else {
                  // array안에 string
                  setSchema({
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  });
                }
              } else {
                // object
                Object.keys(currentValue).forEach((objKey) => {
                  //[TODO] object안에 array 아직 안함.
                  if (typeof currentValue[objKey] === 'object') {
                    makeFixedSchema(
                      currentValue[objKey],
                      makeSchemaPath + '.properties.' + objKey,
                      ''
                    );
                  } else {
                    _.set(
                      fixedSchema,
                      makeSchemaPath + '.properties.' + objKey,
                      { type: 'string' }
                    );
                  }
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
        fillSchemaByFormData(obj, makeObjPath);
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
        const result = !Array.isArray(_.get(formData, makeObjPath))
          ? _.entries(_.get(formData, makeObjPath)).map(([key, value]) => {
              return { [key]: value };
            })
          : _.get(formData, makeObjPath);
        // _.set(formData, makeObjPath, [result]);
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
  const makeCustomUISchema = (
    obj: any,
    prevSchemaPath: string,
    prevUISchemaPath: string
  ) => {
    Object.keys(obj).forEach((currKey) => {
      const makeSchemaPath = prevSchemaPath
        ? `${prevSchemaPath}.properties.${currKey}`
        : `properties.${currKey}`;
      const makeUIPath = prevUISchemaPath
        ? `${prevUISchemaPath}.${currKey}`
        : currKey;

      if (
        (_.get(fixedSchema, makeSchemaPath) &&
          !_.get(fixedSchema, makeSchemaPath + '.type') &&
          'properties' in _.get(fixedSchema, makeSchemaPath)) ||
        (_.get(jsonSchema, makeSchemaPath + '.type') === 'array' &&
          _.get(jsonSchema, makeSchemaPath + '.items.properties'))
      ) {
        _.set(customUISchema, makeUIPath, {
          [`ui:dependency`]: {
            path: makeUIPath,
            type: !!prevUISchemaPath ? 'child' : 'parent',
          },
        });
        if (Array.isArray(obj[currKey])) {
          Object.keys(
            _.get(fixedSchema, makeSchemaPath + '.items.properties')
          ).forEach((cur) => {
            _.set(customUISchema, makeUIPath + `.items.${cur}`, {
              [`ui:dependency`]: { path: makeUIPath, type: 'child' },
            });
          });
          for (let idx = 0; idx < obj[currKey].length; idx++) {
            makeCustomUISchema(
              obj[currKey][idx],
              makeSchemaPath + '.items',
              makeUIPath + '.items'
            );
          }
        } else {
          makeCustomUISchema(obj[currKey], makeSchemaPath, makeUIPath);
        }
      } else if (
        _.get(fixedSchema, makeSchemaPath) &&
        _.get(fixedSchema, makeSchemaPath + '.type') === 'map'
      ) {
        _.set(customUISchema, makeUIPath, {
          [`ui:field`]: 'MapField',
        });
      } else {
        _.set(customUISchema, makeUIPath, {
          [`ui:dependency`]: {
            path: makeUIPath,
            type: prevUISchemaPath ? 'child' : 'parent',
          },
        });
      }

      // if (!!prevUISchemaPath) {
      //   _.set(customUISchema, makeUIPath, {
      //     [`ui:dependency`]: { path: makeUIPath, type: 'child' },
      //   });
      // }
    });
  };

  if (!_.isEmpty(formData)) {
    makeFixedSchema(formData, '', '');
    makeCustomUISchema(formData, '', '');
  }
  return { customUISchema, formData, fixedSchema };
};

type SchemaField = {
  type: string;
  items?: SchemaType;
};
type SchemaType = {
  type: string;
  properties?: any;
};
export default preDefinedData;
