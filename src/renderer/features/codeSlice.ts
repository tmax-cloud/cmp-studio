import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import * as _ from 'lodash-es';

interface CodeSlice {
  objects: any;
}

const initialState: CodeSlice = {
  objects: {},
};

export const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setInitObjects: (state, action: PayloadAction<any>) => {
      state.objects = action.payload; //_.defaultsDeep(action.payload); <- 자동으로 내부적으로 immer로 불변성 유지해준다고 함.
    },
  },
});

export const { setInitObjects } = codeSlice.actions;

export default codeSlice.reducer;
