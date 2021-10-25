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

export const addCustomField = (content: any, object: any, input: any) => {
  const type = Object.keys(content)[0]; // ['provider', 'resource', 'datasource']
  const name = type && Object.keys(content[type])[0];
  const displayName = name && Object.keys(content[type][name])[0];
  const result = _.merge(
    {
      [type]: { [name]: { [displayName]: { [input.key]: '' } } },
    },
    content
  );
  console.log(result);
  return result;
};
