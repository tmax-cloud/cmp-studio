import * as React from 'react';
import * as _ from 'lodash-es';
import { List } from '@mui/material';

import { useAppSelector } from '@renderer/app/store';
import { selectCommandTerraformResponseData } from '@renderer/features/commandSliceInputSelectors';
import DiffItem from './DiffItem';
import parse from './utils/terraformPlanParser';
import * as TerraformPlanType from '../common/terraformPlan';

const DiffTab = () => {
  const { status, data, message } = useAppSelector(
    selectCommandTerraformResponseData
  );

  const plan: TerraformPlanType.Plan = React.useMemo(() => {
    if (status === 'SUCCESS') {
      return parse(data);
    }
    return message;
  }, [data]);

  return (
    <List>
      {status === 'SUCCESS'
        ? parse(data).actions.map((action, idx) => (
            <DiffItem key={action.type + idx} action={action} />
          ))
        : message}
    </List>
  );
};

export default DiffTab;
