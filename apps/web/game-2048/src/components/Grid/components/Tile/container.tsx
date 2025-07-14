import assert from 'node:assert';

import {isValid2048Value} from '@/helpers/check-helpers.js';

import {TileView} from './view.js';
import {useViewModel} from './view-model.js';

export interface TileProps {
  value: number;
  newlyCreated: boolean;
}

export function Tile(props: TileProps) {
  const {value, newlyCreated} = props;
  assert(isValid2048Value(value));
  const {backgroundColor, textColor, fontSize} = useViewModel(value);

  return (
    <TileView
      value={value}
      backgroundColor={backgroundColor}
      textColor={textColor}
      fontSize={fontSize}
      newlyCreated={newlyCreated}
    />
  );
}
