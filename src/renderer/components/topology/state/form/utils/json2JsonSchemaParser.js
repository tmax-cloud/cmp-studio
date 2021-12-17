import terraformSchema from '../terraform_schema.json';

function parseJson(clouds) {
  function renameKey(obj, oldKey, newKey) {
    if (oldKey in obj) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
  }
  function mergeKey(obj, oldKey, newKey) {
    if (newKey in obj) {
      Object.assign(obj[newKey], obj[oldKey]);
      delete obj[oldKey];
    }
  }
  function parseKey(obj, oldKey1, oldKey2, newKey) {
    if (obj.hasOwnProperty(newKey)) {
      Object.assign(obj[newKey], obj[oldKey1][oldKey2]);
    } else {
      obj[newKey] = obj[oldKey1][oldKey2];
    }
    delete obj[oldKey1][oldKey2];
  }
  function buildSchema(schemaData) {
    schemaData.required = [];
    Object.keys(schemaData.properties).forEach(function (k) {
      if (schemaData.properties[k].type === 'bool') {
        schemaData.properties[k].type = 'boolean';
      } else if (Array.isArray(schemaData.properties[k].type)) {
        if (
          schemaData.properties[k].type[0] === 'list' ||
          schemaData.properties[k].type[0] === 'set'
        ) {
          if (
            Array.isArray(schemaData.properties[k].type[1]) &&
            typeof schemaData.properties[k].type[1][1] === 'object'
          ) {
            Object.keys(schemaData.properties[k].type[1][1]).forEach(function (
              l
            ) {
              if (schemaData.properties[k].type[1][1][l] === 'bool') {
                schemaData.properties[k].type[1][1][l] = {
                  type: 'boolean',
                };
              } else if (
                typeof schemaData.properties[k].type[1][1][l] === 'object' &&
                Array.isArray(schemaData.properties[k].type[1][1][l])
              ) {
                if (
                  schemaData.properties[k].type[1][1][l][0] === 'list' ||
                  schemaData.properties[k].type[1][1][l][0] === 'set'
                ) {
                  if (
                    Array.isArray(schemaData.properties[k].type[1][1][l][1])
                  ) {
                    // 아직 object[] 에 object[] 가 있는 경우는 아직 못봄
                    const currentObject = {};
                    Object.keys(
                      schemaData.properties[k].type[1][1][l][1][1]
                    ).forEach((key) => {
                      currentObject.properties = {
                        ...currentObject.properties,
                        [key]:
                          schemaData.properties[k].type[1][1][l][1][1][key],
                      };
                    });
                    schemaData.properties[k].items = currentObject;
                  } else {
                    const currentObject = {
                      type: 'array',
                      items: { type: 'string' },
                    };
                    schemaData.properties[k].type[1][1][l] = currentObject;
                  }
                } else if (schemaData.properties[k].type[1][1][l] === 'map') {
                  const currentObject = {
                    type: 'map',
                    items: { type: 'string' },
                  };
                  schemaData.properties[k].type[1][1][l] = currentObject;
                }
              } else {
                schemaData.properties[k].type[1][1][l] = {
                  type: schemaData.properties[k].type[1][1][l],
                };
              }
            });
            schemaData.properties[k].items = {
              properties: schemaData.properties[k].type[1][1],
            };
          } else {
            schemaData.properties[k].items = {
              type: schemaData.properties[k].type[1],
            };
          }
          schemaData.properties[k].type = 'array';
        } else if (schemaData.properties[k].type[0] === 'map') {
          if (Array.isArray(schemaData.properties[k].type[1])) {
            typeof schemaData.properties[k].type[1][1] === 'object' &&
              Object.keys(schemaData.properties[k].type[1][1]).forEach(
                function (l) {
                  schemaData.properties[k].type[1][1][l] = {
                    type: schemaData.properties[k].type[1][1][l],
                  };
                }
              );
            schemaData.properties[k].items = {
              properties: schemaData.properties[k].type[1][1],
            };
          } else {
            schemaData.properties[k].items = {
              type: schemaData.properties[k].type[1],
            };
          }
          schemaData.properties[k].type = 'map';
        }
      }

      if (
        schemaData.properties[k].hasOwnProperty('required') &&
        schemaData.properties[k].required
      ) {
        schemaData.required.push(k);
        delete schemaData.properties[k].required;
      }
      if (
        schemaData.properties[k].hasOwnProperty('block') &&
        schemaData.properties[k].hasOwnProperty('nesting_mode') &&
        (schemaData.properties[k].block.hasOwnProperty('attributes') ||
          schemaData.properties[k].block.hasOwnProperty('block_types'))
      ) {
        if (schemaData.properties[k].block.hasOwnProperty('attributes')) {
          parseKey(
            schemaData.properties[k],
            'block',
            'attributes',
            'properties'
          );
        }
        if (schemaData.properties[k].block.hasOwnProperty('block_types')) {
          parseKey(
            schemaData.properties[k],
            'block',
            'block_types',
            'properties'
          );
        }
        delete schemaData.properties[k].block;
        return buildSchema(schemaData.properties[k]);
      }
    });
  }
  const schemaMap = new Map();
  const typeList = ['provider', 'resource', 'data'];
  let schemaList;
  const schemaArray = [];
  let tmpPath;
  for (const cloud of clouds) {
    for (const type of typeList) {
      if (type === 'provider') {
        schemaList = [terraformSchema.provider_schemas[cloud].provider];
        tmpPath = terraformSchema.provider_schemas[cloud].provider;
      } else if (type === 'resource') {
        schemaList = Object.getOwnPropertyNames(
          terraformSchema.provider_schemas[cloud].resource_schemas
        );
        tmpPath = terraformSchema.provider_schemas[cloud].resource_schemas;
      } else if (type === 'data') {
        schemaList = Object.getOwnPropertyNames(
          terraformSchema.provider_schemas[cloud].data_source_schemas
        );
        tmpPath = terraformSchema.provider_schemas[cloud].data_source_schemas;
      }
      for (let key of schemaList) {
        // if (_.isEmpty(tmpPath.block)) {
        //   // eslint-disable-next-line no-continue
        //   continue;
        // }
        let schemaData = {};
        if (type === 'provider') {
          schemaData = tmpPath.block;
          key = cloud;
        } else {
          schemaData = tmpPath[key].block;
        }
        if (Object.keys(schemaData).length > 0) {
          renameKey(schemaData, 'attributes', 'properties');
          mergeKey(schemaData, 'block_types', 'properties');
        }
        if (key === 'aws_security_group') {
          console.log(key);
        }
        schemaData.properties &&
          Object.keys(schemaData.properties).length > 0 &&
          buildSchema(schemaData);
        schemaData.title = type + '-' + key;
        schemaArray.push(schemaData);
        schemaMap.set(schemaData.title, schemaData);
      }
    }
  }

  return schemaMap;
}
export default parseJson;
