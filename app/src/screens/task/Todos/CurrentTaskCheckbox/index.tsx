import * as React from 'react';
import styles from './styles.module.css';
import icon from 'icons/current.png';

interface IProps {
  isChecked: boolean;
  onClick: () => void;
}

export default function CurrentTaskCheckbox({ isChecked, onClick }: IProps) {
  function handleClick(e: React.SyntheticEvent<any>) {
    e.stopPropagation();
    onClick();
  }

  if (isChecked) {
    return (
      <span
        role="img"
        aria-label="current-task"
        className={styles.checked}
        onClick={handleClick}
      >
        <img alt="current-task" className={styles.image} src={icon}></img>
      </span>
    );
  }

  return <div className={styles.unchecked} onClick={handleClick} />;
}
