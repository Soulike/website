import {useMemo} from 'react';

import {useViewportHeight} from '@/hooks/useViewportHeight.js';
import {useViewportWidth} from '@/hooks/useViewportWidth.js';

export function useResponsiveTileGap() {
  const viewportWidth = useViewportWidth();
  const viewportHeight = useViewportHeight();

  const gapSizes = useMemo(() => {
    const vw = viewportWidth / 100;
    const vh = viewportHeight / 100;
    const gapSize = Math.min(2 * vw, 2 * vh, 10);

    return {
      horizontal: gapSize,
      vertical: gapSize,
    };
  }, [viewportWidth, viewportHeight]);

  return {
    gapSizes,
  };
}
