import * as _ from 'lodash-es';

export const addSchemaBasedField = (
  content: any,
  object: any,
  input: string
) => {
  const type = Object.keys(content)[0]; // ['provider', 'resource', 'datasource']
  const name = type && Object.keys(content[type])[0];
  const displayName = name && Object.keys(content[type][name])[0];
  const result = _.merge(
    {
      [type]: { [name]: { [displayName]: { [input]: '' } } },
    },
    content
  );
  console.log(result);
  return result;
};

const setAdditionalSchemaByType = (key: string, type: string) => {
  let newSchema = {};
  switch (type) {
    case 'string': {
      newSchema = { type: 'string' };
      break;
    }
    case 'object': {
      newSchema = {
        type: 'map',
        items: {
          type: 'string',
        },
      };
      break;
    }
    case 'array': {
      newSchema = {
        type: 'array',
        items: {
          type: 'string',
        },
      };
      break;
    }
    case 'boolean': {
      newSchema = {
        type: 'boolean',
      };
      break;
    }
    default:
  }
  return { properties: { [key]: newSchema } };
};

export const addCustomField = (content: any, input: any, sourceSchema: any) => {
  const type = Object.keys(content)[0]; // ['provider', 'resource', 'datasource']
  const name = type && Object.keys(content[type])[0];
  const displayName = name && Object.keys(content[type][name])[0];
  const object = _.defaultsDeep(
    {
      [type]: { [name]: { [displayName]: { [input.key]: '' } } },
    },
    content
  );
  const schema = _.defaultsDeep(
    setAdditionalSchemaByType(input.key, input.type),
    sourceSchema
  );

  return { object, schema };
};
