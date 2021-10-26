import * as React from 'react';
import * as _ from 'lodash-es';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@renderer/app/store';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { useSelector, useDispatch } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import DynamicForm from '../index';
import { addSelectedField } from '../../../features/codeSlice';
import { addSchemaBasedField, addCustomField } from '../utils/addInputField';

const useStyles = makeStyles({
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
  const inputTypeList = ['string', 'map', 'boolean'];
  const dispatch = useDispatch();

  const [additionalSchema, setAdditionalSchema] = React.useState('');
  const [customFieldType, setCustomFieldType] = React.useState('');
  const [customFieldKey, setCustomFieldKey] = React.useState('');

  const selectObject = createSelector(
    [(state: RootState) => _.defaultsDeep(state.code)],
    (code) => _.defaultsDeep(code)
  );
  const {
    selectedObjectInfo: { id, content },
  } = useSelector(selectObject);

  const terraformSchemaMap = getSchemaMap();
  const currentSchema: any = terraformSchemaMap.get(id);
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
            <TextField
              id={id}
              sx={{ width: '250px' }}
              className={classes.root}
              select
              label="스키마"
              onChange={(e) => {
                setAdditionalSchema(e.target.value);
              }}
              defaultValue={currentSchema?.properties[0]}
              // value={value || value === 0 ? value : ''}
            >
              {currentSchema &&
                Object.keys(currentSchema?.properties).map((cur) => (
                  <MenuItem key={cur} value={cur}>
                    {cur}
                  </MenuItem>
                ))}
            </TextField>
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
            <TextField
              id={id}
              sx={{ width: '250px' }}
              className={classes.root}
              select
              label="타입"
              onChange={(e) => {
                setCustomFieldType(e.target.value);
              }}
              // value={value || value === 0 ? value : ''}
            >
              {currentSchema &&
                inputTypeList.map((cur) => (
                  <MenuItem key={cur} value={cur}>
                    {cur}
                  </MenuItem>
                ))}
            </TextField>
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
                const result = addCustomField(content, formData, {
                  type: customFieldType,
                  key: customFieldKey,
                });
                dispatch(addSelectedField(result));
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

const EditorTab = (props: EditorTabProps) => {
  const { schema, formData, uiSchema } = props;
  return (
    <>
      <div
        style={{
          paddingTop: '12px',
          height: '650px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <DynamicForm schema={schema} formData={formData} uiSchema={uiSchema} />
      </div>
      <AddFieldSection formData={formData} />
    </>
  );
};

type EditorTabProps = {
  schema: any;
  formData: any;
  uiSchema: any;
};

export default EditorTab;
