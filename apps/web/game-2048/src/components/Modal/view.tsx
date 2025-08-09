import {Paper} from '@mui/material';
import classNames from 'classnames';
import {type ReactNode} from 'react';

import {Overlay} from './components/Overlay/index.js';
import styles from './styles.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({open, onClose, children, className}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <Overlay onClick={onClose} />
      <Paper className={classNames(styles.modal, className)} elevation={8}>
        {children}
      </Paper>
    </>
  );
}
