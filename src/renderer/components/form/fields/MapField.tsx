import React from 'react';
import * as _ from 'lodash-es';

import { FieldProps } from '@rjsf/core';

import {
  Box,
  Divider,
  Typography,
  Grid,
  FormControl,
  TextField,
} from '@mui/material';
import AddButton from '../AddButton';
import IconButton from '../IconButton';

const MapField = (props: FieldProps) => {
  const {
    children,
    disabled,
    idSchema,
    readonly,
    required,
    name,
    onChange,
    formData,
  } = props;
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
                            return { [e.target.value]: value };
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

      <Box mb={1} mt={1}>
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
      </Box>
    </>
  );
};

export default MapField;
