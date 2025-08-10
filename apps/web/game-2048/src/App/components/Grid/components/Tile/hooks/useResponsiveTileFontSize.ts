import {useMemo} from 'react';

import {TileFontSize} from '@/constants/tile-font-size.js';
import {useViewportHeight} from '@/hooks/useViewportHeight.js';
import {useViewportWidth} from '@/hooks/useViewportWidth.js';

export function useResponsiveTileFontSize() {
  const viewportWidth = useViewportWidth();
  const viewportHeight = useViewportHeight();

  const fontSizes = useMemo(() => {
    const vw = viewportWidth / 100;
    const vh = viewportHeight / 100;

    return {
      [TileFontSize.NORMAL]: Math.min(12 * vw, 12 * vh, 48),
      [TileFontSize.SMALL]: Math.min(10 * vw, 10 * vh, 40),
      [TileFontSize.SMALLER]: Math.min(8 * vw, 8 * vh, 32),
    };
  }, [viewportWidth, viewportHeight]);

  const fontSizeCSS = useMemo(
    () => ({
      [TileFontSize.NORMAL]: `${fontSizes[TileFontSize.NORMAL]}px`,
      [TileFontSize.SMALL]: `${fontSizes[TileFontSize.SMALL]}px`,
      [TileFontSize.SMALLER]: `${fontSizes[TileFontSize.SMALLER]}px`,
    }),
    [fontSizes],
  );

  return {
    fontSizeCSS,
  };
}
