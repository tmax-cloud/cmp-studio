import { configureStore } from '@reduxjs/toolkit';

import currentDataReducer from '../features/form/currentDataSlice';

const rootReducer = {
  currentData: currentDataReducer,
};

const store: any = configureStore({
  reducer: rootReducer, // 리듀서들로 구성된 객체 (내부적으로 combineReducers해줌.)
  // middleware: [] // 작성 안하면 기본 미들웨어 세팅됨 (ex. redux-thunk)
  devTools: process.env.NODE_ENV !== 'production', // boolean으로 리덕스 개발자도구 사용할 건지 유무 선택
  preloadedState: {}, // 스토어의 초기값 설정
  // enhancers: [],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
