import * as React from 'react';
import * as _ from 'lodash-es';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@renderer/app/store';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowDropDown } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import DynamicForm from '../index';
import { addSchemaBasedField, addCustomField } from '../utils/addInputField';
import {
  addSelectedField,
  setSelectedSourceSchema,
} from '../../../features/codeSlice';

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
  const inputTypeList = ['string', 'object', 'array', 'boolean'];
  const dispatch = useDispatch();

  const [additionalSchema, setAdditionalSchema] = React.useState('');
  const [customFieldType, setCustomFieldType] = React.useState('');
  const [customFieldKey, setCustomFieldKey] = React.useState('');

  const {
    selectedObjectInfo: { id, content, sourceSchema },
  } = useSelector((state: RootState) => state.code);

  const terraformSchemaMap: Map<any, any> = React.useMemo(
    () => getSchemaMap(),
    []
  );
  const currentSchema = React.useMemo(
    () => terraformSchemaMap.get(id),
    [terraformSchemaMap, id]
  );
  React.useEffect(() => {
    dispatch(setSelectedSourceSchema(currentSchema));
  }, []);
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
const SaveSection = (props: SaveSectionProps) => {
  const { saveLabel, cancelLabel } = props;
  return (
    <div style={{ textAlign: 'end', padding: '20px 10px' }}>
      <Button variant="outlined">{cancelLabel || '취소'}</Button>
      <Button variant="contained">{saveLabel || '저장'}</Button>
    </div>
  );
};

type SaveSectionProps = {
  saveLabel: string;
  cancelLabel: string;
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
      <SaveSection saveLabel="저장" cancelLabel="취소" />
    </>
  );
};

type EditorTabProps = {
  schema: any;
  formData: any;
  uiSchema: any;
};

export default EditorTab;
