import * as React from 'react';
import * as _ from 'lodash-es';
import { createStyles, makeStyles } from '@mui/styles';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch } from '@renderer/app/store';
import { setSidePanel } from '@renderer/features/uiSlice';
import { getIcon } from '@renderer/utils/iconUtil';

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginLeft: '5px',
      marginBottom: '6px',
    },
  })
);

const FormHeader = (props: FormHeaderProps) => {
  const { title, type } = props;
  const dispatch = useAppDispatch();
  const classes = useStyles();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ display: 'flex', margin: '8px' }}>
        <img
          alt="icon"
          style={{ width: 24 }}
          src={getIcon(true, type, title, type === 'data')}
        />
        <h2 className={classes.title}>{title}</h2>
      </span>
      <IconButton
        aria-label="Close"
        onClick={() => {
          dispatch(setSidePanel(false));
        }}
      >
        <Close />
      </IconButton>
    </div>
  );
};

type FormHeaderProps = {
  title: string;
  type: string;
};

export default FormHeader;
