import {useEffect, useState} from 'react';

import {EMPTY_TILE_Z_INDEX, TILE_Z_INDEX} from '@/constants/animation.js';
import {EMPTY_TILE_VALUE} from '@/constants/configs.js';
import {
  getTileBackgroundColor,
  getTileTextColor,
} from '@/helpers/color-helpers.js';
import {getTileFontSize} from '@/helpers/font-size-helpers.js';

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
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    setBackgroundColor(getTileBackgroundColor(tileValue));
  }, [tileValue]);

  return backgroundColor;
}

export function useTextColor(tileValue: number) {
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    setTextColor(getTileTextColor(tileValue));
  }, [tileValue]);

  return textColor;
}

export function useFontSize(tileValue: number) {
  const [fontSize, setFontSize] = useState('');

  useEffect(() => {
    setFontSize(getTileFontSize(tileValue));
  }, [tileValue]);

  return fontSize;
}

export function useZIndex(tileValue: number) {
  const [zIndex, setZIndex] = useState(TILE_Z_INDEX);
  useEffect(() => {
    if (tileValue === EMPTY_TILE_VALUE) {
      setZIndex(EMPTY_TILE_Z_INDEX);
    } else {
      setZIndex(TILE_Z_INDEX);
    }
  }, [tileValue]);
  return zIndex;
}
