import * as React from 'react';
import * as _ from 'lodash-es';
import { makeStyles } from '@mui/styles';
import {
  ListItem,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
} from '@mui/material';
import * as TerraformPlanType from '../common/terraformPlan';

const useStyles: any = makeStyles({
  planItem: {
    borderLeft: '3px solid #519bf0',
    backgroundColor: 'white',
    listStyle: 'none',
    margin: '4px',
  },
  flexBox: {
    display: 'flex',
  },
});

type DiffItemProps = {
  action: TerraformPlanType.Action;
};

type ItemTypeProps = {
  type: string;
};

type ItemNameProps = {
  nameObj: TerraformPlanType.ResourceId;
};

type ItemNumProps = {
  count: number;
};

const ItemType = ({ type }: ItemTypeProps) => (
  <Typography variant="h5">{type.toUpperCase()}</Typography>
);

const ItemName = ({ nameObj }: ItemNameProps) => {
  // const name
  return (
    <>
      <Typography>{nameObj.name}</Typography>
    </>
  );
};

const ItemNum = ({ count }: ItemNumProps) => {
  return (
    <>
      <Typography>{count + 'change' + (count > 1 ? 's' : '')}</Typography>
    </>
  );
};

const DiffItem = (props: DiffItemProps) => {
  const { action } = props;
  const classes = useStyles();
  return (
    <ListItem className={classes.planItem}>
      <Accordion>
        <AccordionSummary>
          <Box className={classes.flexBox}>
            <ItemType type={action.type} />
            <ItemName nameObj={action.id} />
            <ItemNum count={action.changes ? action.changes.length : 0} />
          </Box>
        </AccordionSummary>
      </Accordion>
    </ListItem>
  );
};

export default DiffItem;
