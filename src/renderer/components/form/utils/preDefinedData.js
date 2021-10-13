import * as _ from 'lodash';
const isEmpty = (obj) => _.isEmpty(obj);
const preDefinedData = (jsonSchema = {}, obj = {}) => {
  console.log(isEmpty(obj));
  const type = !isEmpty(obj) && Object.keys(obj)[0]; // ['provider', 'resource', 'datasource']
  const name = !isEmpty(obj) && Object.keys(obj[type])[0]; //
  const displayName = !isEmpty(obj) && Object.keys(obj[type][name])[0];
  const formData =
    (!isEmpty(obj) && _.cloneDeep(obj[type][name][displayName])) || {};
  const filterdList = Object.keys(formData).filter((key) => formData[key]);

  const fixedSchema = _.cloneDeep(jsonSchema) || {};
  const uiSchema = (!isEmpty(obj) && _.cloneDeep(formData)) || {};

  // uiSchema 변환 로직 `${}`로 분기처리로 변환해주는 로직
  // !isEmpty(obj) &&
  //   Object.keys(uiSchema).forEach((curKey) => {
  //     if (
  //       typeof uiSchema[curKey] === 'string' &&
  //       _.startsWith(uiSchema[curKey], '${')
  //     ) {
  //       uiSchema[curKey] = {
  //         [`ui:widget`]: 'textarea',
  //       };
  //     }
  //   });

  // fixedSchema 변환 로직
  // for (const curKey in jsonSchema?.properties) {
  //   if (filterdList.indexOf(curKey) < 0) {
  //     delete fixedSchema.properties[curKey];
  //   } else {
  //     // string 타입이 아닌데 테라폼 syntax 사용되서 정의 된 경우
  //     // eslint-disable-next-line no-lonely-if
  //     if (
  //       !isEmpty(obj) &&
  //       typeof uiSchema[curKey] !== 'string' &&
  //       `ui:widget` in uiSchema[curKey]
  //     ) {
  //       fixedSchema.properties[curKey].type = 'string';
  //     }
  //   }
  // }

  return { uiSchema, formData, fixedSchema };
};
export default preDefinedData;
