import { JSONSchema7 } from 'json-schema';
export const setSchemaMap = (schemaJson: string) => {
  localStorage.setItem('schemaJson', schemaJson);
};

export const getSchemaMap = (): Map<string, JSONSchema7> => {
  const schemaJson = localStorage.getItem('schemaJson') as string;
  return new Map(JSON.parse(schemaJson));
};
