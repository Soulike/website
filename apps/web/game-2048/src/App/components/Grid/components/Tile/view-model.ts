import {useMemo} from 'react';

import {EMPTY_TILE_Z_INDEX, TILE_Z_INDEX} from '@/constants/animation.js';
import {EMPTY_TILE_VALUE} from '@/constants/configs.js';

import {
  getTileBackgroundColor,
  getTileTextColor,
} from './helpers/color-helpers.js';
import {getTileFontSize} from './helpers/font-size-helpers.js';
import {useResponsiveTileFontSize} from './hooks/useResponsiveTileFontSize.js';

export function useViewModel(tileValue: number) {
  const backgroundColor = useBackgroundColor(tileValue);
  const textColor = useTextColor(tileValue);
  const fontSize = useFontSize(tileValue);
  const zIndex = useZIndex(tileValue);

  return {
    backgroundColor,
    textColor,
    fontSize,
    zIndex,
  };
}

export function useBackgroundColor(tileValue: number) {
  return useMemo(() => getTileBackgroundColor(tileValue), [tileValue]);
}

export function useTextColor(tileValue: number) {
  return useMemo(() => getTileTextColor(tileValue), [tileValue]);
}

export function useFontSize(tileValue: number) {
  const {fontSizeCSS} = useResponsiveTileFontSize();
  return useMemo(() => {
    const sizeType = getTileFontSize(tileValue);
    return fontSizeCSS[sizeType];
  }, [tileValue, fontSizeCSS]);
}

export function useZIndex(tileValue: number) {
  return useMemo(
    () => (tileValue === EMPTY_TILE_VALUE ? EMPTY_TILE_Z_INDEX : TILE_Z_INDEX),
    [tileValue],
  );
}
