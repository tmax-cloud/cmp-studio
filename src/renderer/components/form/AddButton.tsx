import React from 'react';

import { AddButtonProps } from '@rjsf/core';

import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const AddButton: React.FC<AddButtonProps> = (props) => (
  <Button {...props} color="secondary">
    <Add /> Add Item
  </Button>
);

export default AddButton;
