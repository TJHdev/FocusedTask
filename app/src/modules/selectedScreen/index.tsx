import { createSlice } from '@reduxjs/toolkit';
import { IScreens } from 'screens/screens';

const initialState = 'task' as IScreens;

export const slice = createSlice({
  name: 'selectedScreen',
  initialState,
  reducers: {
    openTask: () => 'task' as const,
    openShortcuts: () => 'shortcuts' as const,
    openPreferences: () => 'preferences' as const,
    openChangelog: () => 'changelog' as const,
    openAbout: () => 'about' as const,
    openCurrentTodo: () => 'currentTodo' as const,
  },
});

export const {
  openTask,
  openShortcuts,
  openAbout,
  openPreferences,
  openChangelog,
  openCurrentTodo,
} = slice.actions;

export default slice.reducer;
