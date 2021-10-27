import * as React from 'react';
import * as _ from 'lodash-es';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { getIcon } from '../../topology/TopologySidebar';

const FormHeader = (props: FormHeaderProps) => {
  const { toggleSidePanel, title } = props;
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
          toggleSidePanel(false);
        }}
      >
        <Close />
      </IconButton>
    </div>
  );
};

type FormHeaderProps = {
  toggleSidePanel: any;
  title: string;
};

export default FormHeader;
