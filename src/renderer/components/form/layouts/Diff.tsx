import * as React from 'react';
import * as _ from 'lodash-es';
import { List, ListItem, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useAppSelector } from '@renderer/app/store';
import { selectTerraformState } from '@renderer/features/commonSliceInputSelectors';
import parse from '../utils/terraformPlanParser';
import * as TerraformPlanType from '../common/terraformPlan';

const useStyles: any = makeStyles({
  planItem: {
    borderLeft: '3px solid #519bf0',
    backgroundColor: 'white',
    listStyle: 'none',
    margin: '4px',
  },
});

const DiffTab = () => {
  const terraFormState = useAppSelector(selectTerraformState);
  const classes = useStyles();

  const plan: TerraformPlanType.Plan = React.useMemo(() => {
    return parse(terraFormState);
  }, [terraFormState]);

  if (plan.warnings.length === 0 && plan.actions.length === 0) {
    // TODO: 파싱한 결과물에 에러가 있을 경우 보여줄 화면 렌더해주는 부분
    // displayParsingErrorMessage();
  }
  console.log('pretty plan test: ', parse(terraFormState));
  return (
    <List>
      {plan.actions.map((action, idx) => (
        <ListItem key={action.type + idx} className={classes.planItem}>
          <ListItemText>{action.type}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default DiffTab;
