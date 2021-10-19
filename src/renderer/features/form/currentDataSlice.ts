import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import * as _ from 'lodash-es';

interface CurrentDataSlice {
  obj: any;
}

const initialState: CurrentDataSlice = {
  obj: {},
};

export const currentDataSlice = createSlice({
  name: 'currentData',
  initialState,
  reducers: {
    setObj: (state, action: PayloadAction<any>) => {
      state.obj = action.payload; //_.defaultsDeep(action.payload); <- 자동으로 내부적으로 immer로 불변성 유지해준다고 함.
    },
  },
});

export const { setObj } = currentDataSlice.actions;

export default currentDataSlice.reducer;
