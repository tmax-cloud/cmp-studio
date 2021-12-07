import * as _ from 'lodash-es';
export const addSchemaBasedField = (content: any, input: string) => {
  const result = _.merge({ [input]: '' }, content);
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
const makeObject = ({ input }: makeObjectType) => {
  switch (input.type) {
    case 'string': {
      return { [input.key]: '' };
    }
    case 'object': {
      return { [input.key]: {} };
      break;
    }
    case 'array': {
      return { [input.key]: [] };
    }
    case 'boolean': {
      return { [input.key]: '' };
    }
    default:
  }
  return { [input.key]: '' };
};

type makeObjectType = {
  input: any;
};

export const addCustomField = (content: any, input: any, sourceSchema: any) => {
  const object = _.defaultsDeep(
    makeObject({
      input,
    }),
    content
  );
  const schema = _.defaultsDeep(
    setAdditionalSchemaByType(input.key, input.type),
    sourceSchema
  );

  return { object, schema };
};
