import {Paper} from '@mui/material';
import {type ReactNode, type RefObject} from 'react';

import {Overlay, type OverlayProps} from './components/Overlay/index.js';
import styles from './styles.module.css';

export interface ModalViewProps {
  viewRef: RefObject<HTMLDivElement | null>;
  onOverlayClick: OverlayProps['onClick'];
  children: ReactNode;
}

export function View({viewRef, onOverlayClick, children}: ModalViewProps) {
  return (
    <div className={styles.Modal} ref={viewRef}>
      <Overlay onClick={onOverlayClick} />
      <Paper className={styles.modalContent} elevation={8}>
        {children}
      </Paper>
    </div>
  );
}
