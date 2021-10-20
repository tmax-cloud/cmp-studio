import * as React from 'react';
import * as _ from 'lodash';
import { Drawer, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import DynamicForm from '../form';
import preDefinedData from '../form/utils/preDefinedData';
import { createSelector } from '@reduxjs/toolkit';

export const SIDEPANEL_WIDTH = 500;

// obj
const AWS_ACM_CERTIFICATE_VALIDATION_OBJ = {
  resource: {
    aws_acm_certificate_validation: {
      example: {
        // eslint-disable-next-line no-template-curly-in-string
        certificate_arn: '${test}',
        // validation_record_fqdns: ['a', 'b'],
        timeouts: {
          create: 'true',
        },
      },
    },
  },
};
const AWS_ACMPCA_CERTIFICATE_AUTHORITY = {
  resource: {
    aws_acmpca_certificate_authority: {
      example: {
        certificate_authority_configuration: {
          key_algorithm: 'RSA_4096',
          signing_algorithm: 'SHA512WITHRSA',
          subject: {
            common_name: 'example.com',
          },
        },
        permanent_deletion_time_in_days: 7,
        tags: [{ test: 'good' }, { test2: 'bad' }],
      },
    },
  },
};
const TopologySidePanel: React.FC<TopologySidePanelProps> = ({
  open,
  toggleSidePanel,
  data,
  terraformSchemaMap,
}) => {
  const id = data.id || 'testIdDummy';
  // const { obj } = useAppSelector((state) => state.currentData);
  // const dispatch = useAppDispatch();
  let formSample = {};

  // schema
  console.log('all schema: ', terraformSchemaMap);
  const currentSchema = terraformSchemaMap.get(id);
  console.log('current schema: ', currentSchema);
  if (id === 'resource-aws_acm_certificate_validation') {
    formSample = AWS_ACM_CERTIFICATE_VALIDATION_OBJ;
  } else if (id === 'resource-aws_acmpca_certificate_authority') {
    formSample = AWS_ACMPCA_CERTIFICATE_AUTHORITY;
  }
  console.log('redux 확인:', formSample);
  const {
    customUISchema = {},
    formData = {},
    fixedSchema = {},
  } = preDefinedData(currentSchema, formSample);

  return (
    <>
      <Drawer
        PaperProps={{
          sx: {
            width: SIDEPANEL_WIDTH,
            backgroundColor: '#eff2fd',
            top: TOP_NAVBAR_HEIGHT,
            height: `calc(100% - ${TOP_NAVBAR_HEIGHT}px)`,
          },
        }}
        open={open}
        anchor="right"
        variant="persistent"
      >
        <div style={{ textAlign: 'end' }}>
          <IconButton
            aria-label="Close"
            onClick={() => {
              toggleSidePanel(false);
            }}
          >
            <Close />
          </IconButton>
        </div>
        <div style={{ padding: '50px' }}>
          <DynamicForm
            schema={fixedSchema}
            formData={formData}
            uiSchema={customUISchema}
          />
        </div>
      </Drawer>
    </>
  );
};

type TopologySidePanelProps = {
  open: boolean;
  data: any;
  toggleSidePanel: any;
  terraformSchemaMap: any;
};

export default TopologySidePanel;
