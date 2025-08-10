import {
  type RefObject,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
} from 'react';

export interface ModalViewModelProps {
  open: boolean;
  viewRef: RefObject<HTMLDivElement | null>;
}

export function useViewModel({open, viewRef}: ModalViewModelProps) {
  const openRef = useRef(open);
  const deferredOpen = useDeferredValue(open);

  const playShowAnimation = useCallback(async () => {
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
  }, [viewRef]);

  const playHideAnimation = useCallback(async () => {
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
  }, [viewRef]);

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
  }, [deferredOpen, playHideAnimation, playShowAnimation]);

  return {};
}
