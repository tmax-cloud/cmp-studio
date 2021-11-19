const noInstanceNameTypeList = ['module', 'provider', 'variable', 'output'];
export const getObjectNameInfo = (object: any, type: string) => {
  const resourceName = Object.keys(object)[0];
  if (noInstanceNameTypeList.find((currType) => type === currType)) {
    return { resourceName: '', instanceName: Object.keys(object)[0] };
  }
  return { resourceName, instanceName: Object.keys(object[resourceName])[0] };
};
