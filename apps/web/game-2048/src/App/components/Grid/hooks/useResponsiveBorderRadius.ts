import {useMemo} from 'react';

import {useViewportHeight} from '@/hooks/useViewportHeight.js';
import {useViewportWidth} from '@/hooks/useViewportWidth.js';

export function useResponsiveBorderRadius() {
  const viewportWidth = useViewportWidth();
  const viewportHeight = useViewportHeight();

  return useMemo(() => {
    const vw = viewportWidth / 100;
    const vh = viewportHeight / 100;

    return Math.min(3 * vw, 3 * vh, 15);
  }, [viewportWidth, viewportHeight]);
}
