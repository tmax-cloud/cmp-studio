import React from 'react';
import * as _ from 'lodash-es';

import { utils, FieldProps } from '@rjsf/core';

import { JSONSchema7 } from 'json-schema';
import {
  Box,
  Divider,
  Typography,
  Grid,
  Input,
  FormControl,
  TextField,
  InputLabel,
} from '@mui/material';
import AddButton from '../AddButton';
import IconButton from '../IconButton';

const { ADDITIONAL_PROPERTY_FLAG } = utils;

// type WrapIfAdditionalProps = {
//   children: React.ReactElement;
//   classNames: string;
//   disabled: boolean;
//   id: string;
//   label: string;
//   onDropPropertyClick: (index: string) => (event?: any) => void;
//   onKeyChange: (index: string) => (event?: any) => void;
//   readonly: boolean;
//   required: boolean;
//   schema: JSONSchema7;
// };

const MapField = (props: FieldProps) => {
  const {
    children,
    disabled,
    idSchema,
    readonly,
    required,
    name,
    schema,
    uiSchema,
    onChange,
    formData,
  } = props;
  const keyLabel = `${name} Key`; // i18n ?
  const id = idSchema.$id;
  const additional = true;
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: 'bold',
  };

  const [mapData, setMapData] = React.useState(_.cloneDeep(formData) || []);

  if (!additional) {
    return <>{children}</>;
  }

  return (
    <>
      <Box mb={1} mt={1}>
        <Typography variant="h5">{name}</Typography>
        <Divider />
      </Box>

      {mapData.map((curData: any, idx: number) => {
        const key = Object.keys(curData)[0];
        const value = Object.values(curData)[0];
        return (
          <Grid
            container
            key={`${id}-container_${idx}`}
            alignItems="center"
            spacing={2}
            style={{ marginLeft: '10px' }}
          >
            <Grid item xs>
              <FormControl fullWidth required={required}>
                <TextField
                  value={key || ''}
                  onChange={(e) => {
                    onChange(
                      (() => {
                        const result = mapData.map((cur: any, i: number) => {
                          if (i === idx) {
                            return { [e.target.value]: key };
                          }
                          return cur;
                        });
                        setMapData(_.cloneDeep(result));
                        return result;
                      })()
                    );
                  }}
                  disabled={disabled || readonly}
                  id={`${id}-key`}
                  name={`${id}-key`}
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl fullWidth required={required}>
                <TextField
                  value={value || ''}
                  onChange={(e) => {
                    onChange(
                      (() => {
                        const result = mapData.map((cur: any, i: number) => {
                          if (i === idx) {
                            return { [key]: e.target.value };
                          }
                          return cur;
                        });
                        setMapData(_.defaultsDeep(result));
                        return result;
                      })()
                    );
                  }}
                  disabled={disabled || readonly}
                  id={`${id}-value`}
                  name={`${id}-value`}
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid item>
              <IconButton
                icon="remove"
                tabIndex={-1}
                style={btnStyle as any}
                disabled={disabled || readonly}
                onClick={() => {
                  onChange(
                    (() => {
                      const result = mapData.filter((cur: any, i: number) => {
                        if (idx === i) return false;
                        return true;
                      });
                      setMapData(_.defaultsDeep(result));
                      return result;
                    })()
                  );
                }}
              />
            </Grid>
          </Grid>
        );
      })}
      <AddButton
        className="array-item-add"
        onClick={() => {
          onChange(
            (() => {
              const result = mapData.concat({ '': '' });
              setMapData(_.cloneDeep(result));
              return result;
            })()
          );
        }}
        disabled={disabled || readonly}
      />
    </>
  );
};

export default MapField;
