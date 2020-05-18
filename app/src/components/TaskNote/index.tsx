import React from 'react';
import Input from 'components/Input';
import { updateNote, getNote } from 'modules/task';
import styles from './styles.module.css';
import useSelector from 'hooks/useSelector';
import useDispatch from 'hooks/useDispatch';

export default function TaskNote() {
  const note = useSelector(getNote);
  const dispatch = useDispatch();

  return (
    <Input
      id="note-text"
      className={styles.textarea}
      value={note}
      multiline={true}
      autoFocus={false}
      onChange={value => dispatch(updateNote(value))}
    />
  );
}
