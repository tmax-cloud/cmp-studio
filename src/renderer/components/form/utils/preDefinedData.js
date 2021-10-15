import * as _ from 'lodash';
const isEmpty = (obj) => _.isEmpty(obj);
const preDefinedData = (jsonSchema = {}, obj = {}) => {
  const type = !isEmpty(obj) && Object.keys(obj)[0]; // ['provider', 'resource', 'datasource']
  const name = !isEmpty(obj) && Object.keys(obj[type])[0]; //
  const displayName = !isEmpty(obj) && Object.keys(obj[type][name])[0];
  const formData =
    (!isEmpty(obj) && _.cloneDeep(obj[type][name][displayName])) || {};
  // const filterdList = Object.keys(formData).filter((key) => formData[key]);

  const makePath = () => {};
  const fixedSchema = {};
  const customUISchema = {};
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
      console.log(
        makeSchemaPath(),
        _.get(jsonSchema, makeSchemaPath() + '.type')
      );
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

  //임의로

  const makeCustomUISchema2 = (prevPath) => {
    !_.isEmpty(jsonSchema) &&
      Object.keys(
        prevPath ? _.get(jsonSchema, prevPath) : jsonSchema.properties
      ).forEach((currKey) => {
        const makeSchemaPath = () => {
          if (prevPath) {
            return prevPath + '.' + currKey;
          }
          return `properties.${currKey}`;
        };
        const makeUIPath = () => {
          if (prevPath) {
            return prevPath + `.${currKey}`;
          }
          return `${currKey}`;
        };
        console.log(
          makeSchemaPath(),
          _.get(jsonSchema, makeSchemaPath() + '.type')
        );
        if (
          !_.get(jsonSchema, makeSchemaPath() + '.type') &&
          'properties' in _.get(jsonSchema, makeSchemaPath())
        ) {
          // if ('properties' in _.get(jsonSchema, makeSchemaPath())) {
          makeCustomUISchema2(makeSchemaPath() + '.properties');
          // }
        } else if (_.get(jsonSchema, makeSchemaPath() + '.type') === 'map') {
          _.set(customUISchema, makeUIPath(), {
            [`ui:field`]: 'MapField',
          });
        }
      });
  };
  const makeFixedSchema2 = (prevPath) => {
    !_.isEmpty(jsonSchema) &&
      Object.keys(
        prevPath ? _.get(jsonSchema, prevPath) : jsonSchema.properties
      ).forEach((currKey) => {
        const makePath = () => {
          if (prevPath) {
            return prevPath + '.' + currKey;
          }
          return `properties.${currKey}`;
        };
        console.log(makePath(), _.get(jsonSchema, makePath() + '.type'));
        if (!_.get(jsonSchema, makePath() + '.type')) {
          if ('properties' in _.get(jsonSchema, makePath())) {
            _.set(fixedSchema, makePath(), {
              type: 'object',
              ..._.get(jsonSchema, makePath()),
            });
            makeFixedSchema2(makePath() + '.properties');
          }
        } else if (_.get(jsonSchema, makePath() + '.type') === 'map') {
          _.set(fixedSchema, makePath(), {
            type: 'array',
            items: {
              type: 'object',
            },
          });
        } else {
          _.set(fixedSchema, makePath(), _.get(jsonSchema, makePath()));
        }
      });
  };
  if (!_.isEmpty(formData)) {
    makeFixedSchema(formData, '');
    makeCustomUISchema(formData, '');
  } else {
    makeFixedSchema2('');
    makeCustomUISchema2('');
    // fixedSchema = jsonSchema;
  }
  // const uiSchema = (!isEmpty(obj) && _.cloneDeep(formData)) || {};
  return { customUISchema, formData, fixedSchema };
};
export default preDefinedData;
