import * as React from 'react';

import electron from 'utils/electron/shim';
import useSelector from 'hooks/useSelector';
import { getCurrentTodo, getSelectedScreen } from 'modules/selectors';
import { Screens } from './screens';
import useShortcuts from 'hooks/useShortcuts';
import useTheme from 'hooks/useTheme';
import { useDispatch } from 'react-redux';
import {
  openCurrentTodo,
  openTask,
  //
} from 'modules/selectedScreen';
// import { openTask } from 'modules/selectedScreen';

export default function App() {
  useTheme();
  useShortcuts();
  const dispatch = useDispatch();
  const selectedScreen = useSelector(getSelectedScreen);
  const currentTodo = useSelector(getCurrentTodo);

  let usedSelectedScreen = selectedScreen;
  if (selectedScreen === 'currentTodo' && !currentTodo) {
    usedSelectedScreen = 'task';
  }
  const isCurrentTodo = usedSelectedScreen === 'currentTodo';

  const Screen = Screens[usedSelectedScreen];

  React.useEffect(() => {
    const blurHandler = () => {
      // console.log('blur handler');
      if (currentTodo) {
        dispatch(openCurrentTodo());
      }
    };

    const focusHandler = () => {
      console.log('is focusing');
      if (isCurrentTodo) {
        // dispatch(openTask());
      }
    };

    window.addEventListener('blur', blurHandler);
    window.addEventListener('focus', focusHandler);

    return () => {
      window.removeEventListener('blur', blurHandler);
      window.removeEventListener('focus', focusHandler);
    };
  }, [currentTodo, isCurrentTodo]);

  React.useEffect(() => {
    let eventTargetRef = electron.ipcRenderer.on('global-shortcut', () => {
      if (document.hidden) {
        electron.ipcRenderer.send('show-window');
      } else if (isCurrentTodo) {
        dispatch(openTask());
        electron.ipcRenderer.send('show-window');
      } else {
        electron.ipcRenderer.send('hide-window');
        window.blur();
      }
    });

    return () => {
      eventTargetRef.removeAllListeners('global-shortcut');
    };
  }, [document.hidden, isCurrentTodo]);

  return (
    <div
      style={
        isCurrentTodo
          ? { lineHeight: '15px', padding: '0px 7px' }
          : { padding: '15px 20px 20px' }
      }
    >
      <Screen />
    </div>
  );
}
