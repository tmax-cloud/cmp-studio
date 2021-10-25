import * as React from 'react';
import * as _ from 'lodash-es';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { Close, ArrowDropDown } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { RootState } from '@renderer/app/store';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import DynamicForm from '../form';
import preDefinedData from '../form/utils/preDefinedData';
import { addSelectedField } from '../../features/codeSlice';
import {
  addSchemaBasedField,
  addCustomField,
} from '../form/utils/addInputField';

export const SIDEPANEL_WIDTH = 500;
const useStyles = makeStyles({
  root: {
    '& .css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input': {
      resize: 'vertical',
      width: '222px',
      minHeight: '23px',
    },
  },
});

// 저장 버튼 누르면 redux objects에 content 덮어씌우기나이ㅓㄻ
const TopologySidePanel: React.FC<TopologySidePanelProps> = ({
  isSidePanelOpen,
  toggleSidePanel,
}) => {
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
    selectedObjectInfo,
  } = useSelector(selectObject);

  // schema
  const terraformSchemaMap = getSchemaMap();
  const currentSchema: any = terraformSchemaMap.get(id);
  console.log('current schema: ', currentSchema);
  const {
    customUISchema = {},
    formData = {},
    fixedSchema = {},
  } = id && preDefinedData(currentSchema, content);

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
        open={isSidePanelOpen}
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
        <div
          style={{
            padding: '50px 50px 50px 20px',
            height: 'calc(100% - 450px)',
            overflowY: 'auto',
          }}
        >
          <DynamicForm
            schema={fixedSchema}
            formData={formData}
            uiSchema={customUISchema}
          />
        </div>
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
      </Drawer>
    </>
  );
};

type TopologySidePanelProps = {
  isSidePanelOpen: boolean;
  toggleSidePanel: any;
};

export default TopologySidePanel;
