import * as React from 'react';
import styles from './styles.module.css';
import { ReactComponent as MinimiseIcon } from 'icons/minimise.svg';

interface IProps {
  // onClick: () => void;
  // subject: string;
}

export default function Minimise({}: IProps) {
  return (
    <span className={styles.button}>
      <MinimiseIcon className={styles.button} />
    </span>
  );
}
