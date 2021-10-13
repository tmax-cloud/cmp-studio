import * as React from 'react';
import * as _ from 'lodash';
import { Drawer, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import DynamicForm from '../form';
import preDefinedData from '../form/utils/preDefinedData';

export const SIDEPANEL_WIDTH = 500;

// obj
const AWS_ACM_CERTIFICATE_VALIDATION_OBJ = {
  resource: {
    aws_acm_certificate_validation: {
      example: {
        // eslint-disable-next-line no-template-curly-in-string
        certificate_arn: '${aws_acm_certificate.example.arn}',
        validation_record_fqdns:
          // '${[for record in aws_route53_record.example : record.fqdn]}',
          ['a', 'b'],
      },
    },
  },
};

// const setPredefinedData = (
//   title: string
// ): { uiSchema: any; formData: any; fixedSchema: any } => {
//   let predefinedData = { uiSchema: {}, formData: {}, fixedSchema: {} };

//   // text area 테스트
//   if (title === 'textareaTest') {
//     predefinedData = {
//       uiSchema: {
//         analyzer_name: {
//           'ui:widget': 'textarea',
//           classNames: 'pleasedoitagain',
//         },
//       },
//       formData: {
//         analyzer_name: `jsonencode({
//         "Statement" = [{
//           # This policy allows software running on the EC2 instance to
//           # access the S3 API.
//           "Action" = "s3:*",
//           "Effect" = "Allow",
//         }],
//       })`,
//       },
//       fixedSchema: {},
//     };
//   }

//   return predefinedData;
// };

const TopologySidePanel: React.FC<TopologySidePanelProps> = ({
  open,
  toggleSidePanel,
  data,
  terraformSchemaMap,
}) => {
  const id = data.id || 'testIdDummy';
  let formSample = {};

  // schema
  console.log('all schema: ', terraformSchemaMap);
  const currentSchema = terraformSchemaMap.get(id);
  console.log('current schema: ', currentSchema);
  if (id === 'resource-aws_acm_certificate_validation') {
    formSample = AWS_ACM_CERTIFICATE_VALIDATION_OBJ;
  }

  const {
    uiSchema = {},
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
            uiSchema={uiSchema}
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
