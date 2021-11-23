import * as _ from 'lodash-es';
import { getObjectNameInfo } from './getResourceInfo';
export const addSchemaBasedField = (
  content: any,
  object: any,
  input: string
) => {
  const { type } = content; // ['provider', 'resource', 'datasource']
  const resourceName = Object.keys(content)[0];
  const instanceName = type && Object.keys(content[resourceName])[0];
  const result = _.merge(
    {
      [resourceName]: { [instanceName]: { [input]: '' } },
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
const makeObject = ({
  isResourceNameExist,
  resourceName,
  instanceName,
  input,
}: makeObjectType) => {
  if (isResourceNameExist) {
    return {
      [resourceName]: { [instanceName]: { [input.key]: '' } },
    };
  }
  return {
    [instanceName]: { [input.key]: '' },
  };
};

type makeObjectType = {
  isResourceNameExist: boolean;
  resourceName: string;
  instanceName: string;
  input: any;
};

export const addCustomField = (content: any, input: any, sourceSchema: any) => {
  const { type } = content;
  const { resourceName, instanceName } = getObjectNameInfo(content, type);
  const object = _.defaultsDeep(
    makeObject(!!resourceName, resourceName, instanceName, input),
    content
  );
  const schema = _.defaultsDeep(
    setAdditionalSchemaByType(input.key, input.type),
    sourceSchema
  );

  return { object, schema };
};
