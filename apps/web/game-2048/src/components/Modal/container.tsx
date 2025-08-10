import {type ReactNode, useDeferredValue, useEffect, useRef} from 'react';

import type {OverlayProps} from './components/Overlay/index.js';
import {View} from './view.js';

export interface ModalProps {
  open: boolean;
  onOverlayClick: OverlayProps['onClick'];
  children: ReactNode;
}

export function Modal({open, onOverlayClick, children}: ModalProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  const deferredOpen = useDeferredValue(open);

  const playShowAnimation = async () => {
    if (!viewRef.current) {
      return;
    }
    viewRef.current.style.display = 'block';
    const animation = viewRef.current.animate([{opacity: 0}, {opacity: 1}], {
      duration: 200,
      easing: 'ease-out',
      fill: 'forwards',
    });
    await animation.finished;
  };

  const playHideAnimation = async () => {
    if (!viewRef.current) {
      return;
    }
    const animation = viewRef.current.animate([{opacity: 1}, {opacity: 0}], {
      duration: 150,
      easing: 'ease-in',
      fill: 'forwards',
    });
    await animation.finished;
    viewRef.current.style.display = 'none';
  };

  useEffect(() => {
    const prevOpen = openRef.current;
    if (!prevOpen && deferredOpen) {
      // Show
      void playShowAnimation();
    } else if (prevOpen && !deferredOpen) {
      // Hide
      void playHideAnimation();
    }
    openRef.current = deferredOpen;
  }, [deferredOpen]);

  return (
    <View viewRef={viewRef} onOverlayClick={onOverlayClick}>
      {children}
    </View>
  );
}
