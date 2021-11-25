import * as React from 'react';
import * as _ from 'lodash-es';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  Button,
  MenuItem,
  InputLabel,
  TextField,
  FormControl,
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import {
  addSelectedField,
  setSelectedSourceSchema,
} from '@renderer/features/codeSlice';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { ArrowDropDown } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { selectCode } from '@renderer/features/codeSliceInputSelectors';
import { addSchemaBasedField, addCustomField } from './utils/addInputField';

const useStyles: any = makeStyles((theme) =>
  createStyles({
    wideSelect: {
      resize: 'vertical',
      width: '100%',
      minHeight: '23px',
    },
    narrowSelect: {
      resize: 'vertical',
      width: '220px',
      minHeight: '23px',
    },
    key: {
      width: '260px',
      minHeight: '23px',
    },
  })
);

const AddFieldSection = (props: AddFieldSectionProps) => {
  const { formData } = props;
  const classes = useStyles();

  const inputTypeList = ['string', 'object', 'array', 'boolean'];
  const dispatch = useAppDispatch();
  const terraformSchemaMap: Map<string, JSONSchema7> = getSchemaMap();

  const [additionalSchema, setAdditionalSchema] = React.useState('');
  const [customFieldType, setCustomFieldType] = React.useState('');
  const [customFieldKey, setCustomFieldKey] = React.useState('');
  const [currentSchemaList, setCurrentSchemaList] = React.useState<string[]>(
    []
  );

  const {
    selectedObjectInfo: { id, content, sourceSchema },
  } = useAppSelector(selectCode);

  const initSchemaList = (schema: JSONSchema7) => {
    const selectedSchema =
      sourceSchema && !_.isEmpty(sourceSchema)
        ? Object.keys(sourceSchema.properties)
        : [];

    return _.xor(
      _.intersection(
        selectedSchema,
        Object.keys(schema.properties as JSONSchema7Definition)
      ),
      Object.keys(schema.properties as JSONSchema7Definition)
    );
  };

  React.useEffect(() => {
    const schema: JSONSchema7 = terraformSchemaMap.get(
      id.replace('/', '-')
    ) as JSONSchema7;
    schema && setCurrentSchemaList(initSchemaList(schema) as string[]);
  }, [id, sourceSchema]);

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
          {sourceSchema && !_.isEmpty(sourceSchema) && (
            <div
              style={{
                display: 'flex',
                marginBottom: '10px',
                padding: '16px 0 0 16px',
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="schema-label">스키마</InputLabel>
                <Select
                  labelId="schema-label"
                  id={id}
                  className={classes.wideSelect}
                  label="Schema"
                  value={additionalSchema}
                  onChange={(e) => {
                    setAdditionalSchema(e.target.value);
                  }}
                >
                  {currentSchemaList &&
                    currentSchemaList.map((cur) => (
                      <MenuItem key={cur} value={cur}>
                        {cur}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Button
                onClick={() => {
                  const result = addSchemaBasedField(
                    content,
                    formData,
                    additionalSchema
                  );
                  setCurrentSchemaList((schemaList) =>
                    schemaList.filter((cur) => cur !== additionalSchema)
                  );
                  dispatch(addSelectedField(result));
                  setAdditionalSchema('');
                }}
              >
                추가
              </Button>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              marginBottom: '10px',
              padding: '16px 0 0 16px',
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="schema-label">타입</InputLabel>
              <Select
                id={id}
                sx={{ width: '220px' }}
                className={classes.narrowSelect}
                label="타입"
                value={customFieldType}
                onChange={(e) => {
                  setCustomFieldType(e.target.value);
                }}
              >
                {currentSchemaList &&
                  inputTypeList.map((cur) => (
                    <MenuItem key={cur} value={cur}>
                      {cur}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              id={id}
              className={classes.text}
              label="키"
              value={customFieldKey}
              onChange={(e) => {
                setCustomFieldKey(e.target.value);
              }}
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
                setCustomFieldType('');
                setCustomFieldKey('');
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
