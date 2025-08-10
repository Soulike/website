import {type ReactNode, useRef} from 'react';

import type {OverlayProps} from './components/Overlay/index.js';
import {View} from './view.js';
import {useViewModel} from './view-model.js';

export interface ModalProps {
  open: boolean;
  onOverlayClick: OverlayProps['onClick'];
  children: ReactNode;
}

export function Modal({open, onOverlayClick, children}: ModalProps) {
  const viewRef = useRef<HTMLDivElement>(null);

  useViewModel({open, viewRef});

  return (
    <View viewRef={viewRef} onOverlayClick={onOverlayClick}>
      {children}
    </View>
  );
}
