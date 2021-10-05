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

  // readJSON('./json/terraform_schema.json', function (text) {

  const typeList = ['provider', 'resource', 'datasource'];
  let schemaList;
  const schemaArray = [];
  let tmpPath;

  for (const type of typeList) {
    if (type === 'provider') {
      const schemaData = terraformSchema.provider_schemas.aws.provider.block;
      const requiredField = [];

      renameKey(schemaData, 'attributes', 'properties');
      mergeKey(schemaData, 'block_types', 'properties');

      Object.keys(schemaData.properties).forEach(function (k) {
        if (schemaData.properties[k].type === 'bool') {
          schemaData.properties[k].type = 'boolean';
        } else if (Array.isArray(schemaData.properties[k].type)) {
          if (
            schemaData.properties[k].type[0] === 'list' ||
            schemaData.properties[k].type[0] === 'set'
          ) {
            schemaData.properties[k].type = 'array';
            schemaData.properties[k].items = {
              data_type: { type: 'string' },
              name: { type: 'string' },
            };
          } else if (schemaData.properties[k].type[0] === 'map') {
            schemaData.properties[k].type = 'map';
          }
        }

        if (
          schemaData.properties[k].hasOwnProperty('required') &&
          schemaData.properties[k].required
        ) {
          requiredField.push(k);
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
              if (
                schemaData.properties[k].properties[i].type[0] === 'list' ||
                schemaData.properties[k].properties[i].type[0] === 'set'
              ) {
                schemaData.properties[k].properties[i].type = 'array';
              } else if (
                schemaData.properties[k].properties[i].type[0] === 'map'
              ) {
                schemaData.properties[k].properties[i].type = 'map';
              }
            }
          });
        }
      });

      schemaData.title = 'provider-aws';
      schemaData.required = requiredField;
      schemaArray.push(schemaData);
      schemaMap.set(schemaData.title, schemaData);
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
        const requiredField = [];

        renameKey(schemaData, 'attributes', 'properties');
        mergeKey(schemaData, 'block_types', 'properties');

        Object.keys(schemaData.properties).forEach(function (k) {
          if (schemaData.properties[k].type === 'bool') {
            schemaData.properties[k].type = 'boolean';
          } else if (Array.isArray(schemaData.properties[k].type)) {
            if (
              schemaData.properties[k].type[0] === 'list' ||
              schemaData.properties[k].type[0] === 'set'
            ) {
              schemaData.properties[k].type = 'array';
            } else if (schemaData.properties[k].type[0] === 'map') {
              schemaData.properties[k].type = 'map';
            }
          }

          if (
            schemaData.properties[k].hasOwnProperty('required') &&
            schemaData.properties[k].required
          ) {
            requiredField.push(k);
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
                if (
                  schemaData.properties[k].properties[i].type[0] === 'list' ||
                  schemaData.properties[k].properties[i].type[0] === 'set'
                ) {
                  schemaData.properties[k].properties[i].type = 'array';
                } else if (
                  schemaData.properties[k].properties[i].type[0] === 'map'
                ) {
                  schemaData.properties[k].properties[i].type = 'map';
                }
              }
            });
          }
        });
        schemaData.title = type + '-' + key;
        schemaData.required = requiredField;
        schemaArray.push(schemaData);
        schemaMap.set(schemaData.title, schemaData);
      }
    }
  }
  return schemaMap;
}
export default parseJson;
