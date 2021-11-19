import { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';
import { getObjectNameInfo } from './getResourceInfo';

const supportedSchemaList = ['resource', 'provider', 'output', 'variable'];

const isArray = (currentValue: any) => currentValue.hasOwnProperty('length');

const isResourceType = (type: string) => type === 'resource';

const specialKey = (props: {
  resourceType: string;
  resourceName: string;
  instanceName: string;
  propertyName: string;
}) => {
  return Object.values(props).join('**##**');
  // return resourceType + '**##**' + resourceName + '**##**' + propertyName;
};

const preDefinedFileObjects = (
  resourceType: string,
  jsonSchema: JSONSchema7,
  object: any,
  resourceName: string,
  instanceName: string
) => {
  if (!jsonSchema && _.findIndex(supportedSchemaList, resourceType) >= 0) {
    return { mapObjectTypeList: {}, customizedSchema: {} };
  }

  const customizedSchema = {};
  const mapObjectTypeList: any[] = [];

  const makeCustomizedSchema = (obj: any, prevPath: string) => {
    Object.keys(obj).forEach((currKey) => {
      const makePath = prevPath
        ? `${prevPath}.properties.${currKey}`
        : `properties.${currKey}`;

      const setSchema = (fixedValue: SchemaField, propertyType: string) => {
        const changedProperty = _.last(makePath.split('.')) as string;
        const prefix = makePath.replace(changedProperty, '');
        const customPath =
          prefix +
          specialKey({
            resourceType,
            resourceName,
            instanceName,
            propertyName: currKey,
          });
        if (propertyType === 'object' || propertyType === 'map') {
          _.set(customizedSchema, customPath, fixedValue);
        } else {
          _.set(customizedSchema, makePath, fixedValue);
        }
      };

      const fillSchemaByFormData = (obj: any) => {
        const currentKey = makePath.split('properties.');
        const currentValue = obj[currentKey[1]];
        if (currentKey.length > 1) {
          switch (typeof obj[currentKey[1]]) {
            case 'string': {
              setSchema({ type: 'string' }, 'string');
              break;
            }
            case 'boolean': {
              setSchema({ type: 'boolean' }, 'boolean');
              break;
            }
            case 'object': {
              if (isArray(currentValue)) {
                setSchema(_.get(jsonSchema, makePath), 'object');
              } else {
                setSchema(
                  {
                    type: 'map',
                    items: {
                      type: 'string',
                    },
                  },
                  'map'
                );
              }
              break;
            }
            case 'number': {
              setSchema({ type: 'string' }, 'string');
              break;
            }
            default:
          }
        }
      };
      if (
        !_.get(jsonSchema, makePath) ||
        _.findIndex(supportedSchemaList, (cur) => cur === resourceType) < 0
      ) {
        fillSchemaByFormData(obj);
        return;
      }
      if (
        _.get(jsonSchema, makePath) &&
        !_.get(jsonSchema, makePath + '.type') &&
        'properties' in _.get(jsonSchema, makePath)
      ) {
        setSchema(_.get(jsonSchema, makePath), 'object');
        makeCustomizedSchema(obj[currKey], makePath);
      } else if (_.get(jsonSchema, makePath + '.type') === 'map') {
        setSchema(
          {
            type: 'map',
            items: {
              type: 'string',
            },
          },
          'map'
        );
      } else {
        _.set(customizedSchema, makePath, _.get(jsonSchema, makePath));
      }
    });
  };
  const makeMapObjectTypeList = (obj: any, prevPath: string) => {
    Object.keys(obj).forEach((currKey) => {
      const makeSchemaPath = prevPath
        ? `${prevPath}.properties.${currKey}`
        : `properties.${currKey}`;
      const makeSpecialSchemaPath = prevPath
        ? `${prevPath}.properties.${specialKey({
            resourceType,
            resourceName,
            instanceName,
            propertyName: currKey,
          })}`
        : `properties.${specialKey({
            resourceType,
            resourceName,
            instanceName,
            propertyName: currKey,
          })}`;

      const makePath = _.get(customizedSchema, makeSpecialSchemaPath)
        ? makeSpecialSchemaPath
        : makeSchemaPath;
      if (
        !_.get(customizedSchema, makePath + '.type') &&
        'properties' in _.get(customizedSchema, makePath)
      ) {
        makeMapObjectTypeList(obj[currKey], makePath);
        mapObjectTypeList.push({ [makePath]: 'object' });
      } else if (_.get(customizedSchema, makePath + '.type') === 'map') {
        mapObjectTypeList.push({ [makePath]: 'map' });
      } else if (
        _.get(customizedSchema, makePath + '.type') === 'object' &&
        !_.get(jsonSchema, makePath + '.type')
      ) {
        mapObjectTypeList.push({ [makePath]: 'object' });
      }
    });
  };

  if (!_.isEmpty(object)) {
    makeCustomizedSchema(object, '');
    makeMapObjectTypeList(object, '');
  }
  return { mapObjectTypeList, customizedSchema };
};

type SchemaField = {
  type: string;
  items?: SchemaType;
};
type SchemaType = {
  type: string;
};
export default preDefinedFileObjects;
