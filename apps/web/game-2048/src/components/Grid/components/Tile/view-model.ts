import {useEffect, useState} from 'react';

import {
  getTileBackgroundColor,
  getTileTextColor,
} from '@/helpers/color-helpers.js';
import {getTileFontSize} from '@/helpers/font-size-helpers.js';

export function useViewModel(tileValue: number) {
  const backgroundColor = useBackgroundColor(tileValue);
  const textColor = useTextColor(tileValue);
  const fontSize = useFontSize(tileValue);

  return {
    backgroundColor,
    textColor,
    fontSize,
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
