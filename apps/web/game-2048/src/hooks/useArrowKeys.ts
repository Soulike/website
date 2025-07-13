import {useCallback, useEffect} from 'react';

type ArrowKeyCallback = () => void;

interface ArrowKeyHandlers {
  onUp?: ArrowKeyCallback;
  onDown?: ArrowKeyCallback;
  onLeft?: ArrowKeyCallback;
  onRight?: ArrowKeyCallback;
}

export function useArrowKeys(handlers: ArrowKeyHandlers) {
  const {onUp, onDown, onLeft, onRight} = handlers;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore when modifier keys are used.
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onRight?.();
          break;
        default:
          break;
      }
    },
    [onUp, onDown, onLeft, onRight],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
