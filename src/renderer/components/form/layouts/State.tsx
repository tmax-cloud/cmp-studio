import * as React from 'react';
import * as _ from 'lodash-es';
import { Typography } from '@mui/material';
import { useAppSelector } from '@renderer/app/store';
import { selectTerraformState } from '@renderer/features/commonSliceInputSelectors';
import parse from '../utils/terraformPlanParser';
import * as TerraformPlanType from '../common/terraformPlan';

const StateTab = () => {
  const terraFormState = useAppSelector(selectTerraformState);

  const plan: TerraformPlanType.Plan = React.useMemo(() => {
    return parse(terraFormState);
  }, [terraFormState]);

  if (plan.warnings.length === 0 && plan.actions.length === 0) {
    // TODO: 파싱한 결과물에 에러가 있을 경우 보여줄 화면 렌더해주는 부분
    // displayParsingErrorMessage();
  }

  console.log('pretty plan test: ', parse(terraFormState));
  return (
    <Typography
      variant="overline"
      noWrap={true}
      style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}
    >
      {terraFormState}
    </Typography>
  );
};

export default StateTab;
