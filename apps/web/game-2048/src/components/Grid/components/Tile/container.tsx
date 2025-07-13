import assert from 'node:assert';

import {isValid2048Value} from '@/helpers/check-helpers.js';
import {
  getTileBackgroundColor,
  getTileTextColor,
} from '@/helpers/color-helpers.js';

import {TileView} from './view.js';

export interface TileProps {
  value: number;
}

export function Tile(props: TileProps) {
  const {value} = props;
  assert(isValid2048Value(value));
  const backgroundColor = getTileBackgroundColor(value);
  const textColor = getTileTextColor(value);

  return (
    <TileView
      value={value}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
}
