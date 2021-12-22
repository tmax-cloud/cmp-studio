import { Item } from './TopologyLibraryItemList';
import parseJson from '../state/form/utils/json2JsonSchemaParser';

export type Provider = 'aws' | 'tls';

const providerList: Provider[] = ['aws', 'tls'];

const tempResourceMap = new Map();
const tempDatasourceMap = new Map();
providerList.forEach((provider) => {
  const tempMap = parseJson([provider]);
  const tempResourceList: Item[] = [];
  const tempDatasourceList: Item[] = [];
  tempMap.forEach((schema) => {
    const schemaTitle = schema.title;
    const schemaResourceName = schema.title.split('-')[1];
    const schemaType = schema.title.split('-')[0];
    if (schemaType === 'resource') {
      tempResourceList.push({
        instanceName: schemaTitle,
        resourceName: schemaResourceName,
        type: schemaType,
      });
    }
    if (schemaType === 'data') {
      tempDatasourceList.push({
        instanceName: schemaTitle,
        resourceName: schemaResourceName,
        type: schemaType,
      });
    }
  });
  tempResourceMap.set(provider, tempResourceList);
  tempDatasourceMap.set(provider, tempDatasourceList);
});
export const resourceMap = tempResourceMap;
export const datasourceMap = tempDatasourceMap;
