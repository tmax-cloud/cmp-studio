import React from 'react';

import { FieldProps } from '@rjsf/core';

import { Box, Divider, Typography } from '@mui/material';

const TitleField = ({ title, required }: FieldProps) => {
  const displayTitle = required ? title + ' *' : title;
  return (
    <>
      <Box mb={1} mt={1}>
        <Typography variant="h5">{displayTitle}</Typography>
        <Divider />
      </Box>
    </>
  );
};
export default TitleField;
