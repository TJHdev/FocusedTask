import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as types from './types';
import generateId from 'utils/generateId';

import {
  createTodo,
  createBookmark,
  find,
  findIndex,
  insertAfter,
  move,
  paste,
} from './utils';

type IWithId = types.IWithId;

export type ITask = types.ITask;
export type ITodo = types.ITodo;
export type IBookmark = types.IBookmark;

const INITIAL_STATE = {
  id: generateId('task'),
  title: 'Focus',
  currentTodo: undefined,
  todos: [],
  bookmarks: [],
  note: '',
} as types.ITask;

type IOptionalPayload<T> = { payload: T | undefined };

export const slice = createSlice({
  name: 'task',
  initialState: INITIAL_STATE,
  reducers: {
    updateTaskTitle: (state, { payload }) => {
      state.title = payload;
    },
    newTodo: (
      state,
      {
        payload = {},
      }: IOptionalPayload<{ after?: { id: string; ident: number } }>,
    ) => {
      const after = payload.after;

      insertAfter(state.todos, after, createTodo({ after }));
    },
    pasteTasks: (
      state,
      { payload }: PayloadAction<{ id: string; clipboard: string }>,
    ) => {
      paste(
        state.todos,
        payload,
        (todo, text) => (todo.text = text),
        (after, text) => createTodo({ after, text }),
      );
    },
    toggleCurrentTodo: (state, { payload }: PayloadAction<ITodo>) => {
      if (state.currentTodo !== payload.id) {
        state.currentTodo = payload.id;
      } else {
        state.currentTodo = undefined;
      }
    },

    toggleCompletedTodo: (state, { payload }: PayloadAction<ITodo>) => {
      const index = findIndex(state.todos, payload);

      if (index === -1) {
        return;
      }

      const todo = state.todos[index];

      todo.isCompleted = !todo.isCompleted;
      todo.autoCompleted = false;

      for (let i = index + 1; i < state.todos.length; i += 1) {
        const other = state.todos[i];

        if (other.ident <= todo.ident) {
          break;
        }

        if (todo.isCompleted === other.isCompleted) {
          continue;
        }

        if (todo.isCompleted) {
          other.isCompleted = true;
          other.autoCompleted = true;
        } else if (other.autoCompleted) {
          other.isCompleted = false;
          other.autoCompleted = false;
        }
      }
    },
    updateTodoIdent: (
      state,
      { payload }: PayloadAction<{ id: string; by: number }>,
    ) => {
      const todo = find(state.todos, payload);
      todo.ident = Math.max(0, todo.ident + payload.by);
    },
    updateTodoText: (state, { payload }) => {
      if (payload.text) {
        const todo = find(state.todos, payload);
        todo.text = payload.text;
      } else {
        state.todos = state.todos.filter((t) => t.id !== payload.id);
      }
    },
    removeTodo: (state, { payload }: PayloadAction<ITodo>) => {
      state.todos = state.todos.filter((todo) => todo.id !== payload.id);
    },
    moveTodo: (
      state,
      // { payload }: PayloadAction<{ id: string; by: string }>,
      { payload },
    ) => {
      move(state.todos, payload, payload.by);
    },
    removeCompletedTodos: (state) => {
      state.todos = state.todos.filter((todo) => !todo.isCompleted);
    },
    newBookmark: (
      state,
      { payload = {} }: IOptionalPayload<{ after?: IWithId; uri?: string }>,
    ) => {
      insertAfter(state.bookmarks, payload.after, createBookmark());
    },
    newBookmarkBatch: (
      state,
      { payload = { uris: [] } }: IOptionalPayload<{ uris: string[] }>,
    ) => {
      payload.uris.forEach((uri) => {
        if (uri) {
          insertAfter(state.bookmarks, undefined, createBookmark({ uri }));
        }
      });
    },
    pasteBookmarks: (
      state,
      { payload }: PayloadAction<{ id: string; clipboard: string }>,
    ) => {
      paste(
        state.bookmarks,
        payload,
        (bookmark, text) => (bookmark.uri = text),
        (_, text) => createBookmark({ uri: text }),
      );
    },
    updateBookmark: (
      state,
      { payload }: PayloadAction<{ id: string; uri: string }>,
    ) => {
      if (payload.uri) {
        const bookmark = find(state.bookmarks, payload);
        bookmark.uri = payload.uri;
      } else {
        state.bookmarks = state.bookmarks.filter((b) => b.id !== payload.id);
      }
    },
    removeBookmark: (state, { payload }: PayloadAction<IBookmark>) => {
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark.id !== payload.id,
      );
    },
    moveBookmark: (
      state,
      // { payload }: PayloadAction<{ id: string; by: number }>,
      { payload },
    ) => {
      move(state.bookmarks, payload, payload.by);
    },
    updateNote: (state, { payload }: PayloadAction<string>) => {
      state.note = payload;
    },
  },
});

export const {
  updateTaskTitle,
  removeCompletedTodos,
  newTodo,
  pasteTasks,
  updateNote,
  toggleCurrentTodo,
  toggleCompletedTodo,
  updateTodoText,
  updateTodoIdent,
  removeTodo,
  moveTodo,
  newBookmark,
  newBookmarkBatch,
  updateBookmark,
  removeBookmark,
  pasteBookmarks,
  moveBookmark,
} = slice.actions;

export default slice.reducer;
