import * as React from 'react';
import * as _ from 'lodash-es';
import { Typography } from '@mui/material';
import { useAppSelector } from '@renderer/app/store';
import { selectCommandTerraformResponseData } from '@renderer/features/commandSliceInputSelectors';

const StateTab = () => {
  const { status, data, message } = useAppSelector(
    selectCommandTerraformResponseData
  );

  // const plan: TerraformPlanType.Plan = React.useMemo(() => {
  //   return parse(terraFormState);
  // }, [terraFormState]);

  // if (plan.warnings.length === 0 && plan.actions.length === 0) {
  //   // TODO: 파싱한 결과물에 에러가 있을 경우 보여줄 화면 렌더해주는 부분
  //   // displayParsingErrorMessage();
  // }

  return (
    <Typography
      variant="overline"
      noWrap={true}
      style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}
    >
      {status === 'SUCCESS' ? data : message}
    </Typography>
  );
};

export default StateTab;
