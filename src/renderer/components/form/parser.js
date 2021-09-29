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
        if (data.properties[k].type === 'bool') {
          data.properties[k].type = 'boolean';
        } else if (Array.isArray(data.properties[k].type)) {
          if (data.properties[k].type[0] === 'list') {
            data.properties[k].type[0] = 'array';
          } else if (
            data.properties[k].type[0] === 'set' ||
            data.properties[k].type[0] === 'map'
          ) {
            data.properties[k].type = 'object';
          }
        }

        if (data.properties[k].required) {
          delete data.properties[k].required;
        }

        if (
          data.properties[k].hasOwnProperty('block') &&
          data.properties[k].block.hasOwnProperty('attributes')
        ) {
          replaceKey(data.properties[k], 'block', 'attributes', 'properties');

          Object.keys(data.properties[k].properties).forEach(function (i) {
            if (data.properties[k].properties[i].type === 'bool') {
              data.properties[k].properties[i].type = 'boolean';
            } else if (Array.isArray(data.properties[k].properties[i].type)) {
              if (data.properties[k].properties[i].type[0] === 'list') {
                data.properties[k].properties[i].type[0] = 'array';
              } else if (
                data.properties[k].properties[i].type[0] === 'set' ||
                data.properties[k].properties[i].type[0] === 'map'
              ) {
                data.properties[k].properties[i].type = 'object';
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
          if (schemaData.properties[k].type === 'bool') {
            schemaData.properties[k].type = 'boolean';
          } else if (Array.isArray(schemaData.properties[k].type)) {
            if (schemaData.properties[k].type[0] === 'list') {
              schemaData.properties[k].type[0] = 'array';
            } else if (
              schemaData.properties[k].type[0] === 'set' ||
              schemaData.properties[k].type[0] === 'map'
            ) {
              schemaData.properties[k].type = 'object';
            }
          }
          if (schemaData.properties[k].required) {
            delete schemaData.properties[k].required;
          }

          if (
            schemaData.properties[k].hasOwnProperty('block') &&
            schemaData.properties[k].block.hasOwnProperty('attributes')
          ) {
            replaceKey(
              schemaData.properties[k],
              'block',
              'attributes',
              'properties'
            );

            Object.keys(schemaData.properties[k].properties).forEach(function (
              i
            ) {
              if (schemaData.properties[k].properties[i].type === 'bool') {
                schemaData.properties[k].properties[i].type = 'boolean';
              } else if (
                Array.isArray(schemaData.properties[k].properties[i].type)
              ) {
                if (schemaData.properties[k].properties[i].type[0] === 'list') {
                  schemaData.properties[k].properties[i].type[0] = 'array';
                } else if (
                  schemaData.properties[k].properties[i].type[0] === 'set' ||
                  schemaData.properties[k].properties[i].type[0] === 'map'
                ) {
                  schemaData.properties[k].properties[i].type = 'object';
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
