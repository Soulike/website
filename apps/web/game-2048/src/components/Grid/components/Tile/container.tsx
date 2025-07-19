import assert from 'node:assert';

import {useEffect, useRef, useState} from 'react';

import {isValid2048Value} from '@/helpers/check-helpers.js';

import {type Animate, TileView} from './view.js';
import {useViewModel} from './view-model.js';

export interface TileProps {
  value: number;
  animate: Animate | null;
  updatedAtTimestamp: number;
}

export function Tile(props: TileProps) {
  const {value, animate, updatedAtTimestamp} = props;
  const [internalValue, setInternalValue] = useState(0);
  const {backgroundColor, textColor, fontSize} = useViewModel(internalValue);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    assert(isValid2048Value(value), 'Invalid 2048 tile value');
  }, [value]);

  useEffect(() => {
    if (!animate || !viewRef.current) {
      setInternalValue(value);
      return;
    }
    void animate(viewRef.current).then(() => {
      setInternalValue(value);
    });
  }, [animate, value, updatedAtTimestamp]);

  return (
    <TileView
      ref={viewRef}
      value={internalValue}
      backgroundColor={backgroundColor}
      textColor={textColor}
      fontSize={fontSize}
      zIndex={internalValue === 0 ? 0 : 1000}
    />
  );
}
