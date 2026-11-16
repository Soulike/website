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

  const handleTouchStart = useCallback((touchEvent: TouchEvent) => {
    // Prevent scrolling and other default behaviors
    touchEvent.preventDefault();

    const touch = touchEvent.touches[0];
    if (touch === undefined) {
      return;
    }
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchMove = useCallback((touchEvent: TouchEvent) => {
    // Prevent scrolling during touch move
    touchEvent.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(
    (touchEvent: TouchEvent) => {
      const touchEnd = touchEvent.changedTouches[0];
      const touchStart = touchStartRef.current;

      if (touchEnd === undefined || !touchStart) {
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

      // Prevent default behavior for valid swipe gestures
      touchEvent.preventDefault();

      // Determine direction based on which axis has larger movement
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          onRight?.();
        } else {
          onLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onDown?.();
        } else {
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
    // Use passive: false to allow preventDefault()
    const options = {passive: false};

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, options);
      element.addEventListener('touchmove', handleTouchMove, options);
      element.addEventListener('touchend', handleTouchEnd, options);
      element.addEventListener('touchcancel', handleTouchCancel, options);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchCancel);
      };
    }

    window.addEventListener('touchstart', handleTouchStart, options);
    window.addEventListener('touchmove', handleTouchMove, options);
    window.addEventListener('touchend', handleTouchEnd, options);
    window.addEventListener('touchcancel', handleTouchCancel, options);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    element,
  ]);
}
