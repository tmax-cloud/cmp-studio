import * as React from 'react';
import * as _ from 'lodash-es';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  Button,
  MenuItem,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  addSelectedField,
  setSelectedSourceSchema,
} from '@renderer/features/codeSlice';
import { ArrowDropDown } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { selectCode } from '@renderer/features/codeSliceInputSelectors';
import { addSchemaBasedField, addCustomField } from '../utils/addInputField';

const useStyles: any = makeStyles({
  root: {
    '& .css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input': {
      resize: 'vertical',
      width: '222px',
      minHeight: '23px',
    },
  },
});

const AddFieldSection = (props: AddFieldSectionProps) => {
  const { formData } = props;
  const classes = useStyles();

  const inputTypeList = ['string', 'object', 'array', 'boolean'];
  const dispatch = useAppDispatch();

  const [additionalSchema, setAdditionalSchema] = React.useState('');
  const [customFieldType, setCustomFieldType] = React.useState('');
  const [customFieldKey, setCustomFieldKey] = React.useState('');

  const {
    selectedObjectInfo: { id, content, sourceSchema },
  } = useAppSelector(selectCode);
  React.useLayoutEffect(() => {
    setAdditionalSchema('');
    setCustomFieldType('');
  }, [formData]);
  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDown />}>
          입력 필드 추가
        </AccordionSummary>
        <AccordionDetails>
          <div
            style={{
              display: 'flex',
              marginBottom: '10px',
              padding: '16px 0 0 16px',
            }}
          >
            <Select
              id={id}
              sx={{ width: '250px' }}
              className={classes.root}
              label="스키마"
              value={additionalSchema}
              onChange={(e) => {
                setAdditionalSchema(e.target.value);
              }}
            >
              {sourceSchema &&
                Object.keys(sourceSchema?.properties).map((cur) => (
                  <MenuItem key={cur} value={cur}>
                    {cur}
                  </MenuItem>
                ))}
            </Select>
            <Button
              onClick={() => {
                const result = addSchemaBasedField(
                  content,
                  formData,
                  additionalSchema
                );
                dispatch(addSelectedField(result));
                setAdditionalSchema('');
              }}
            >
              추가
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              marginBottom: '10px',
              padding: '16px 0 0 16px',
            }}
          >
            <Select
              id={id}
              sx={{ width: '250px' }}
              className={classes.root}
              label="타입"
              value={customFieldType}
              onChange={(e) => {
                setCustomFieldType(e.target.value);
              }}
            >
              {sourceSchema &&
                inputTypeList.map((cur) => (
                  <MenuItem key={cur} value={cur}>
                    {cur}
                  </MenuItem>
                ))}
            </Select>
            <TextField
              id={id}
              sx={{ width: '250px', marginLeft: '16px' }}
              className={classes.root}
              label="키"
              onChange={(e) => {
                setCustomFieldKey(e.target.value);
              }}
              // value={value || value === 0 ? value : ''}
            />
            <Button
              onClick={() => {
                const { object, schema } = addCustomField(
                  content,
                  {
                    type: customFieldType,
                    key: customFieldKey,
                  },
                  sourceSchema
                );
                dispatch(addSelectedField(object));
                dispatch(setSelectedSourceSchema(schema));
                setAdditionalSchema('');
              }}
            >
              추가
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

type AddFieldSectionProps = {
  formData: any;
};

export default AddFieldSection;
