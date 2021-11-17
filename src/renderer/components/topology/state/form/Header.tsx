import * as React from 'react';
import * as _ from 'lodash-es';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch } from '@renderer/app/store';
import { setSidePanel } from '@renderer/features/uiSlice';
import { getIcon } from '../../TopologySidebar';

const FormHeader = (props: FormHeaderProps) => {
  const { title } = props;
  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ display: 'flex', margin: '8px' }}>
        {getIcon(title.split('-')[0])}
        <h2>{title}</h2>
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
};

export default FormHeader;
