import * as _ from 'lodash-es';
import { getObjectNameInfo } from './getResourceInfo';
export const addSchemaBasedField = (content: any, input: string) => {
  const { type, resourceName, ...object } = content;
  const { instanceName } = getObjectNameInfo(object, type);
  const result = _.merge(
    {
      [instanceName]: { [input]: '' },
    },
    content
  );
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
const makeObject = ({ instanceName, input }: makeObjectType) => {
  return {
    [instanceName]: { [input.key]: '' },
  };
};

type makeObjectType = {
  instanceName: string;
  input: any;
};

export const addCustomField = (content: any, input: any, sourceSchema: any) => {
  const { type, resourceName, ...obj } = content;
  const { instanceName } = getObjectNameInfo(obj, type);
  const object = _.defaultsDeep(
    makeObject({
      instanceName,
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
