import terraformSchema from './terraform_schema.json';
function parseJson() {
  function renameKey(obj, oldKey, newKey) {
    if (oldKey in obj) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
  }

  function mergeKey(obj, oldKey, newKey) {
    Object.assign(obj[newKey], obj[oldKey]);
    delete obj[oldKey];
  }

  function replaceKey(obj, oldKey1, oldKey2, newKey) {
    obj[newKey] = obj[oldKey1][oldKey2];
    delete obj[oldKey1];
  }
  const schemaMap = new Map();

  const typeList = ['provider', 'resource', 'datasource'];
  let schemaList;
  const schemaArray = [];
  let tmpPath;

  for (const type of typeList) {
    if (type === 'provider') {
      const data = terraformSchema.provider_schemas.aws.provider.block;
      renameKey(data, 'attributes', 'properties');
      mergeKey(data, 'block_types', 'properties');

      Object.keys(data.properties).forEach(function (k) {
        if (k.type === 'bool') {
          k.type = 'boolean';
        } else if (Array.isArray(k.type)) {
          if (k.type[0] === 'list') {
            k.type[0] = 'array';
          } else if (k.type[0] === 'set' || k.type[0] === 'map') {
            k.type = 'object';
          }
        }

        if (k.hasOwnProperty('block') && k.block.hasOwnProperty('attributes')) {
          replaceKey(k, 'block', 'attributes', 'properties');

          Object.keys(k.properties).forEach(function (i) {
            if (k.properties[i].type === 'bool') {
              k.properties[i].type = 'boolean';
            } else if (Array.isArray(k.properties[i].type)) {
              if (k.properties[i].type[0] === 'list') {
                k.properties[i].type[0] = 'array';
              } else if (
                k.properties[i].type[0] === 'set' ||
                k.properties[i].type[0] === 'map'
              ) {
                k.properties[i].type = 'object';
              }
            }
          });
        }
      });

      data.title = 'provider-aws';
      schemaArray.push(data);
      schemaMap.set(data.title, data);
    } else {
      if (type === 'resource') {
        schemaList = Object.getOwnPropertyNames(
          terraformSchema.provider_schemas.aws.resource_schemas
        );
        tmpPath = terraformSchema.provider_schemas.aws.resource_schemas;
      } else if (type === 'datasource') {
        schemaList = Object.getOwnPropertyNames(
          terraformSchema.provider_schemas.aws.data_source_schemas
        );
        tmpPath = terraformSchema.provider_schemas.aws.data_source_schemas;
      }

      for (const key of schemaList) {
        const schemaData = tmpPath[key].block;

        renameKey(schemaData, 'attributes', 'properties');
        mergeKey(schemaData, 'block_types', 'properties');

        Object.keys(schemaData.properties).forEach(function (k) {
          if (k.type === 'bool') {
            k.type = 'boolean';
          } else if (Array.isArray(k.type)) {
            if (k.type[0] === 'list') {
              k.type[0] = 'array';
            } else if (k.type[0] === 'set' || k.type[0] === 'map') {
              k.type = 'object';
            }
          }

          if (
            k.hasOwnProperty('block') &&
            k.block.hasOwnProperty('attributes')
          ) {
            replaceKey(k, 'block', 'attributes', 'properties');

            Object.keys(k.properties).forEach(function (i) {
              if (i.type === 'bool') {
                i.type = 'boolean';
              } else if (Array.isArray(i.type)) {
                if (i.type[0] === 'list') {
                  i.type[0] = 'array';
                } else if (i.type[0] === 'set' || i.type[0] === 'map') {
                  i.type = 'object';
                }
              }
            });
          }
        });
        schemaData.title = type + '-' + key;
        schemaArray.push(schemaData);
        schemaMap.set(schemaData.title, schemaData);
      }
    }
  }
  // alert(JSON.stringify(schemaMap, null, 2));
  // document.write(JSON.stringify(schemaMap));
  // console.log(schemaMap);

  // );

  // var str = JSON.stringify(schemaMap, (key, value) => (value instanceof Map ? [...value] : value)); //JSON.stringify(Array.from(schemaMap.entries()));
  // console.log(schemaMap);
  return schemaMap;
}

export default parseJson;
