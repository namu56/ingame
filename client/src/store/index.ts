import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/es/storage/session';

const reducers = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
