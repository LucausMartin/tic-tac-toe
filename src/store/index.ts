import { configureStore } from '@reduxjs/toolkit';
import recorder from './slices/recordSlice.ts';
import configer from './slices/gameConfigSlice.ts';

const store = configureStore({ reducer: { recorder, configer } });

export default store;

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState;
