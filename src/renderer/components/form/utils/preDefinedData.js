import * as _ from 'lodash';

const preDefinedData = (jsonSchema, object) => {
  if (!jsonSchema) {
    return { customUISchema: {}, formData: {}, fixedSchema: {} };
  }
  const type = !_.isEmpty(object) && Object.keys(object)[0]; // ['provider', 'resource', 'datasource']
  const name = !_.isEmpty(object) && Object.keys(object[type])[0];
  const displayName = !_.isEmpty(object) && Object.keys(object[type][name])[0];
  const formData =
    (!_.isEmpty(object) && _.cloneDeep(object[type][name][displayName])) || {};

  const makePath = () => {};
  const fixedSchema = {};
  const customUISchema = {};

  // formData로 정의된 부분에 대해서만 schema 필터링 (일단 aws_acm_certificate_validation 리소스에 대해서만 해놓음. 다른 스키마들은 밑에 로직 안타서 전체스키마 나오도록 해둠.)
  const makeFixedSchema = (obj, prevPath) => {
    Object.keys(obj).forEach((currKey) => {
      const makePath = () => {
        if (prevPath) {
          return prevPath + `.properties.${currKey}`;
        }
        return `properties.${currKey}`;
      };
      console.log(makePath(), _.get(jsonSchema, makePath() + '.type'));
      if (!_.get(jsonSchema, makePath())) {
        _.set(fixedSchema, makePath(), { type: 'string' });
        return;
      }
      if (
        !_.get(jsonSchema, makePath() + '.type') &&
        'properties' in _.get(jsonSchema, makePath())
      ) {
        makeFixedSchema(obj[currKey], makePath());
      } else if (_.get(jsonSchema, makePath() + '.type') === 'map') {
        _.set(fixedSchema, makePath(), {
          type: 'array',
          items: {
            type: 'object',
          },
        });
        // _.omit(fixedSchema, makePath());
      } else {
        _.set(fixedSchema, makePath(), _.get(jsonSchema, makePath()));
      }
    });
  };
  const makeCustomUISchema = (obj, prevPath) => {
    Object.keys(obj).forEach((currKey) => {
      const makeSchemaPath = () => {
        if (prevPath) {
          return prevPath + `.properties.${currKey}`;
        }
        return `properties.${currKey}`;
      };
      const makeUIPath = () => {
        if (prevPath) {
          return prevPath + `.${currKey}`;
        }
        return `${currKey}`;
      };
      if (!_.get(jsonSchema, makeSchemaPath())) {
        return;
      }
      if (
        !_.get(jsonSchema, makeSchemaPath() + '.type') &&
        'properties' in _.get(jsonSchema, makeSchemaPath())
      ) {
        makeCustomUISchema(obj[currKey], makeSchemaPath());
      } else if (_.get(jsonSchema, makeSchemaPath() + '.type') === 'map') {
        _.set(customUISchema, makeUIPath(), {
          [`ui:field`]: 'MapField',
        });
      }
    });
  };
  if (!_.isEmpty(formData)) {
    makeFixedSchema(formData, '');
    makeCustomUISchema(formData, '');
  }
  // const uiSchema = (!isEmpty(obj) && _.cloneDeep(formData)) || {};
  return { customUISchema, formData, fixedSchema };
};
export default preDefinedData;
