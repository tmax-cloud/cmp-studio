import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, PERSIST } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import graphReducer from '@renderer/features/graphSlice';
import codeReducer from '../features/codeSlice';
import commonReducer from '../features/commonSlice';
import uiReducer from '../features/uiSlice';

const rootPersistConfig = {
  key: 'root',
  blacklist: ['code', 'graph', 'ui'],
  storage,
};

const codePersistConfig = {
  key: 'code',
  blacklist: ['selectedObjectInfo'],
  storage,
};

const rootReducer: any = combineReducers({
  code: persistReducer(codePersistConfig, codeReducer),
  common: commonReducer,
  graph: graphReducer,
  ui: uiReducer,
});
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store: any = configureStore({
  reducer: persistedReducer, // 리듀서들로 구성된 객체 (내부적으로 combineReducers해줌.)
  // middleware: [] // 작성 안하면 기본 미들웨어 세팅됨 (ex. redux-thunk)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // boolean으로 리덕스 개발자도구 사용할 건지 유무 선택
  preloadedState: {}, // 스토어의 초기값 설정

  // enhancers: [],
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
