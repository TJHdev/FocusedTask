import about from './about';
import changelog from './changelog';
import preferences from './preferences';
import shortcuts from './shortcuts';
import task from './task';
import currentTodo from './currentTodo';

export const Screens = {
  about,
  changelog,
  preferences,
  shortcuts,
  task,
  currentTodo,
};

export type IScreens = keyof typeof Screens;
