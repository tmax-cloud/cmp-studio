import * as _ from 'lodash-es';
import { JSONSchema7 } from 'json-schema';

const getPropertyTypeBySchema = (jsonSchema: any): string => {
  if (
    // type이 object인 경우 -> 재귀
    jsonSchema &&
    !_.get(jsonSchema, 'type') &&
    'properties' in jsonSchema
  ) {
    return 'object';
  } else if (_.get(jsonSchema, 'type') === 'map') {
    return 'map';
  } else if (
    _.get(jsonSchema, 'type') === 'array' &&
    _.get(jsonSchema, 'items.properties')
  ) {
    return 'array';
  } else {
    return 'string';
  }
};

export default getPropertyTypeBySchema;
