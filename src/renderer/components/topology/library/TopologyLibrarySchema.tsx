import { Item } from './TopologyLibraryItemList';
import parseJson from '../state/form/utils/json2JsonSchemaParser';

export type Provider = 'aws' | 'tls';

export const providerList: Provider[] = ['aws', 'tls'];

const tempProviderMap = new Map();
const tempResourceMap = new Map();
const tempDatasourceMap = new Map();
providerList.forEach((provider) => {
  const tempMap = parseJson([provider]);
  const tempProviderList: Item[] = [];
  const tempResourceList: Item[] = [];
  const tempDatasourceList: Item[] = [];
  tempMap.forEach((schema) => {
    const schemaTitle = schema.title;
    const schemaResourceName = schema.title.split('-')[1];
    const schemaType = schema.title.split('-')[0];
    const schemaProperties = schema.properties;
    const schemaRequired = schema.required;
    if (schemaType === 'provider') {
      tempProviderList.push({
        instanceName: schemaTitle,
        resourceName: schemaResourceName,
        type: schemaType,
        properties: schemaProperties,
        required: schemaRequired,
      });
    }
    if (schemaType === 'resource') {
      tempResourceList.push({
        instanceName: schemaTitle,
        resourceName: schemaResourceName,
        type: schemaType,
        properties: schemaProperties,
        required: schemaRequired,
      });
    }
    if (schemaType === 'data') {
      tempDatasourceList.push({
        instanceName: schemaTitle,
        resourceName: schemaResourceName,
        type: schemaType,
        properties: schemaProperties,
        required: schemaRequired,
      });
    }
  });
  tempProviderMap.set(provider, tempProviderList);
  tempResourceMap.set(provider, tempResourceList);
  tempDatasourceMap.set(provider, tempDatasourceList);
});
export const providerMap = tempProviderMap;
export const resourceMap = tempResourceMap;
export const datasourceMap = tempDatasourceMap;
