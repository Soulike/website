import {useMemo} from 'react';

import {useViewportHeight} from '@/hooks/useViewportHeight.js';
import {useViewportWidth} from '@/hooks/useViewportWidth.js';

export function useResponsiveGridSize() {
  const viewportWidth = useViewportWidth();
  const viewportHeight = useViewportHeight();

  return useMemo(() => {
    const vw = viewportWidth / 100;
    const vh = viewportHeight / 100;

    return Math.min(90 * vw, 90 * vh, 500);
  }, [viewportWidth, viewportHeight]);
}
