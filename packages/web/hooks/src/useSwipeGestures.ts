import {useCallback, useEffect, useRef} from 'react';

type SwipeCallback = () => void;

export interface SwipeHandlers {
  onUp?: SwipeCallback;
  onDown?: SwipeCallback;
  onLeft?: SwipeCallback;
  onRight?: SwipeCallback;
}

interface SwipeConfig {
  minDistance?: number; // Minimum distance for a swipe to be recognized
  maxTime?: number; // Maximum time for a swipe gesture
  element?: HTMLElement | null; // Target element to attach listeners to
}

const DEFAULT_CONFIG: Required<Omit<SwipeConfig, 'element'>> = {
  minDistance: 50,
  maxTime: 300,
};

export function useSwipeGestures(
  handlers: SwipeHandlers,
  config: SwipeConfig = {},
) {
  const {onUp, onDown, onLeft, onRight} = handlers;
  const {minDistance, maxTime, element} = {...DEFAULT_CONFIG, ...config};

  const touchStartRef = useRef<{x: number; y: number; time: number} | null>(
    null,
  );

  const handleTouchStart = useCallback((event: Event) => {
    const touchEvent = event as TouchEvent;
    // Prevent scrolling and other default behaviors
    touchEvent.preventDefault();

    const touch = touchEvent.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchMove = useCallback((event: Event) => {
    const touchEvent = event as TouchEvent;
    // Prevent scrolling during touch move
    touchEvent.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(
    (event: Event) => {
      const touchEvent = event as TouchEvent;
      const touchEnd = touchEvent.changedTouches[0];
      const touchStart = touchStartRef.current;

      if (!touchStart) {
        return;
      }

      const deltaX = touchEnd.clientX - touchStart.x;
      const deltaY = touchEnd.clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;

      // Check if the gesture is fast enough
      if (deltaTime > maxTime) {
        return;
      }

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check if the distance is sufficient
      if (Math.max(absDeltaX, absDeltaY) < minDistance) {
        return;
      }

      // Determine direction based on which axis has larger movement
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          touchEvent.preventDefault();
          onRight?.();
        } else {
          touchEvent.preventDefault();
          onLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          touchEvent.preventDefault();
          onDown?.();
        } else {
          touchEvent.preventDefault();
          onUp?.();
        }
      }

      touchStartRef.current = null;
    },
    [onUp, onDown, onLeft, onRight, minDistance, maxTime],
  );

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  useEffect(() => {
    // Use the provided element or fallback to window
    const targetElement = element ?? window;

    // Use passive: false to allow preventDefault()
    const options = {passive: false};

    targetElement.addEventListener('touchstart', handleTouchStart, options);
    targetElement.addEventListener('touchmove', handleTouchMove, options);
    targetElement.addEventListener('touchend', handleTouchEnd, options);
    targetElement.addEventListener('touchcancel', handleTouchCancel, options);

    return () => {
      targetElement.removeEventListener('touchstart', handleTouchStart);
      targetElement.removeEventListener('touchmove', handleTouchMove);
      targetElement.removeEventListener('touchend', handleTouchEnd);
      targetElement.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    element,
  ]);
}
