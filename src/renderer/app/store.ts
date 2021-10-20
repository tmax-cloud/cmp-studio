import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import codeReducer from '../features/code';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer: any = combineReducers({
  code: codeReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: any = configureStore({
  reducer: persistedReducer, // 리듀서들로 구성된 객체 (내부적으로 combineReducers해줌.)
  // middleware: [] // 작성 안하면 기본 미들웨어 세팅됨 (ex. redux-thunk)
  devTools: process.env.NODE_ENV !== 'production', // boolean으로 리덕스 개발자도구 사용할 건지 유무 선택
  preloadedState: {}, // 스토어의 초기값 설정

  // enhancers: [],
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
