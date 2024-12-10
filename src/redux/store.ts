import { configureStore } from '@reduxjs/toolkit';
import taskList from './slices/taskListSlice';
import projectList from './slices/projectListSlice';

export const store = configureStore({
  reducer: { taskList, projectList },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
