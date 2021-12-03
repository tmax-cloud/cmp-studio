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
    formData = [],
  } = props;
  const id = idSchema.$id;
  const additional = true;
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: 'bold',
  };

  const [mapData, setMapData] = React.useState(formData);

  React.useEffect(() => {
    setMapData(formData);
  }, [formData]);

  if (!additional) {
    return <>{children}</>;
  }

  return (
    <>
      <Box mb={1} mt={1}>
        <Typography variant="h5">{name}</Typography>
        <Divider />
      </Box>

      {mapData.map((currObj: Map<string, string>, idx: number) => {
        const key = Object.keys(currObj)[0];
        const value = String(Object.values(currObj)[0]);
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
                        const resultObj = {};
                        _.assign(resultObj, { [e.target.value]: value });
                        const result = mapData.map(
                          (cur: Map<string, string>, index: number) => {
                            if (index === idx) return resultObj;
                            return cur;
                          }
                        );
                        setMapData(result);
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
                        const resultObj = {};
                        _.assign(resultObj, { [key]: e.target.value });
                        const result = mapData.map(
                          (cur: Map<string, string>, index: number) => {
                            if (index === idx) return resultObj;
                            return cur;
                          }
                        );
                        setMapData(result);
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
                  return onChange(
                    (() => {
                      const result = mapData.filter(
                        (cur: Map<string, string>) => {
                          const matchingKey = Object.keys(cur)[0];
                          if (matchingKey === key) return false;
                          return true;
                        }
                      );
                      setMapData(result);
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
                // const result = mapData.concat({ '': '' });
                setMapData((currMapData: Map<string, string>[]) => [
                  ...currMapData,
                  { '': '' },
                ]);
                return mapData;
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
