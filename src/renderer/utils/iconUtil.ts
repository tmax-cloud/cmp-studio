import { NodeKind } from '@renderer/types/graph';
import AWSProviderColorIcon from '../../../assets/images/graph-provider-aws-color-icon.svg';
import AWSProviderIcon from '../../../assets/images/graph-provider-aws-icon.svg';
import DatasourceTypeColorIcon from '../../../assets/images/graph-datasource-type-color-icon.svg';
import DatasourceTypeIcon from '../../../assets/images/graph-datasource-type-icon.svg';
import DefaultTypeColorIcon from '../../../assets/images/graph-default-type-color-icon.svg';
import DefaultTypeIcon from '../../../assets/images/graph-default-type-icon.svg';
import ModuleTypeColorIcon from '../../../assets/images/graph-module-type-color-icon.svg';
import ModuleTypeIcon from '../../../assets/images/graph-module-type-icon.svg';
import OutputTypeColorIcon from '../../../assets/images/graph-output-type-color-icon.svg';
import ResourceTypeColorIcon from '../../../assets/images/graph-resource-type-color-icon.svg';
import ResourceTypeIcon from '../../../assets/images/graph-resource-type-icon.svg';
import VariableTypeColorIcon from '../../../assets/images/graph-variable-type-color-icon.svg';

export const getIcon = (
  color: boolean,
  type: NodeKind,
  name: string,
  dataSource?: boolean
) => {
  switch (type) {
    case 'data':
      return color ? DatasourceTypeColorIcon : DatasourceTypeIcon;
    case 'module':
      return color ? ModuleTypeColorIcon : ModuleTypeIcon;
    case 'provider':
      if (name === 'aws') {
        return color ? AWSProviderColorIcon : AWSProviderIcon;
      }
      return color ? DefaultTypeColorIcon : DefaultTypeIcon;
    case 'resource':
      return color ? ResourceTypeColorIcon : ResourceTypeIcon;
    case 'output':
      return OutputTypeColorIcon;
    case 'variable':
    case 'var':
      return VariableTypeColorIcon;
    default:
      if (dataSource) {
        return color ? DatasourceTypeColorIcon : DatasourceTypeIcon;
      }
      return color ? ResourceTypeColorIcon : ResourceTypeIcon;
  }
};
