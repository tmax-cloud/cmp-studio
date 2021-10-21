export const setSchemaMap = (schemaJson: string) => {
  localStorage.setItem('schemaJson', schemaJson);
};

export const getSchemaMap = () => {
  const schemaJson = localStorage.getItem('schemaJson') as string;
  return new Map(JSON.parse(schemaJson));
};
