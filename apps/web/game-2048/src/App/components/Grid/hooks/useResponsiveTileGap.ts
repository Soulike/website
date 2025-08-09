import {useMemo} from 'react';

import {useViewportHeight} from '@/hooks/useViewportHeight.js';
import {useViewportWidth} from '@/hooks/useViewportWidth.js';

export function useResponsiveTileGap() {
  const viewportWidth = useViewportWidth();
  const viewportHeight = useViewportHeight();

  return useMemo(() => {
    const vw = viewportWidth / 100;
    const vh = viewportHeight / 100;
    return Math.min(2 * vw, 2 * vh, 10);
  }, [viewportWidth, viewportHeight]);
}
