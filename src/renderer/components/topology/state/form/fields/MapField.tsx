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

  //Editor.tsx 에서 onChange 에서 redux 값을 sidepanel과 동기화 했을때, configurable 속성이 false 로 변경된것을 찾을때 쓴 테스트 코드
  //React.useEffect(() => {
  //  console.log(Object.getOwnPropertyDescriptors(mapData));
  //}, [mapData]);

  //Editor.tsx 에서 onChange 에서 redux 값을 sidepanel과 동기화 했을때, configurable 속성이 false 로 변경되는것을 확인
  //이부분 제거했을때, 정상동작으로 추정됨
  //Editor.tsx 에서 onChange 에서 redux 값을 sidepanel과 동기화와 목적이 동일해 보여서 제거하고 테스트 함
  //React.useEffect(() => {
  //  setMapData(formData);
  //}, [formData]);

  if (!additional) {
    return <>{children}</>;
  }

  return (
    <>
      <Box mb={1} mt={1}>
        <Typography variant="h5">{name}</Typography>
        <Divider />
      </Box>

      {_.toPairs(mapData).map(([key, value], idx) => {
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
                        const result = {};
                        _.toPairs(mapData).forEach(
                          ([curKey, curValue], i: number) => {
                            if (i === idx) {
                              _.assign(result, { [e.target.value]: curValue });
                            } else {
                              _.assign(result, { [curKey]: curValue });
                            }
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
                        const result = {};
                        _.toPairs(mapData).forEach(
                          ([curKey, curValue]: any, i: number) => {
                            if (i === idx) {
                              _.assign(result, { [curKey]: e.target.value });
                            } else {
                              _.assign(result, { [curKey]: curValue });
                            }
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
                      _.toPairs(mapData).forEach(
                        ([curKey, curValue], i: number) => {
                          if (idx === i) {
                            delete mapData[curKey];
                          }
                        }
                      );
                      setMapData(_.defaultsDeep(mapData));
                      return mapData;
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
                setMapData(_.cloneDeep(_.assign(mapData, { '': '' })));
                return _.cloneDeep(_.assign(mapData, { '': '' }));
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
