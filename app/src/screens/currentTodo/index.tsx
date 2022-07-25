import * as React from 'react';
// import Stack from 'components/Stack';
// import BackButton from 'components/BackButton';
import { useSelector } from 'react-redux';
import { getCurrentTodo } from 'modules/selectors';
// import styles from './styles.module.css';
// import ExternalLink from 'components/ExternalLink';
// import logo from 'icons/logo.png';
// import { appVersion } from 'utils/electron';

export default function CurrentTodo() {
  const currentTodo = useSelector(getCurrentTodo);

  if (!currentTodo) {
    return null;
  }

  return (
    <div style={{ display: 'flex' }}>
      <strong>{currentTodo.text}</strong>
    </div>
  );
}
