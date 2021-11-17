import { JSONSchema7 } from 'json-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiSlice {
  isSidePanelOpen: boolean;
}

const initialState: UiSlice = {
  isSidePanelOpen: false,
};

const uiSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setSidePanel: (state, action: PayloadAction<any>) => {
      state.isSidePanelOpen = action.payload;
    },
  },
});

export const { setSidePanel } = uiSlice.actions;

export default uiSlice.reducer;
