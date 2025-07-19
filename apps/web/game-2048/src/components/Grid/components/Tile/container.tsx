import assert from 'node:assert';

import {useEffect} from 'react';

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
  const {backgroundColor, textColor, fontSize} = useViewModel(value);

  useEffect(() => {
    assert(isValid2048Value(value), 'Invalid 2048 tile value');
  }, [value]);

  return (
    <TileView
      value={value}
      backgroundColor={backgroundColor}
      textColor={textColor}
      fontSize={fontSize}
      animate={animate}
      updatedAtTimestamp={updatedAtTimestamp}
    />
  );
}
