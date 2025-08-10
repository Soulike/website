import assert from 'node:assert';

import {useEffect, useRef, useState} from 'react';

import {
  MOVING_TILE_Z_INDEX,
  TILE_MOVE_ANIMATION_DURATION,
} from '@/constants/animation.js';
import {isValid2048Value} from '@/helpers/check-helpers.js';

import {createInPlaceCloneElement} from './helpers/dom-helpers.js';
import {type Animate, TileView} from './view.js';
import {useViewModel} from './view-model.js';

export interface TileProps {
  value: number;
  isMovementDestination: boolean;
  creationAnimate: Animate | null;
  movementAnimate: Animate | null;
  mergeAnimate: Animate | null;
  updatedAtTimestamp: number;
}

export function Tile(props: TileProps) {
  const {
    value,
    creationAnimate,
    movementAnimate,
    mergeAnimate,
    updatedAtTimestamp,
    isMovementDestination,
  } = props;
  const [internalValue, setInternalValue] = useState(0);
  const {backgroundColor, textColor, fontSize, zIndex} =
    useViewModel(internalValue);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    assert(isValid2048Value(value), 'Invalid 2048 tile value');
  }, [value]);

  useEffect(() => {
    if (!viewRef.current) {
      setInternalValue(value);
      return;
    }
    if (
      !creationAnimate &&
      !movementAnimate &&
      !mergeAnimate &&
      !isMovementDestination
    ) {
      setInternalValue(value);
      return;
    }
    if (movementAnimate) {
      const clone = createInPlaceCloneElement(viewRef.current);
      clone.style.zIndex = MOVING_TILE_Z_INDEX.toString();
      document.body.appendChild(clone);
      setInternalValue(0);
      void movementAnimate(clone).then(() => {
        document.body.removeChild(clone);
        assert(viewRef.current);
        setInternalValue(value);
      });
    }
    if (mergeAnimate) {
      const viewElement = viewRef.current;
      setTimeout(() => {
        setInternalValue(value);
        void mergeAnimate(viewElement);
      }, TILE_MOVE_ANIMATION_DURATION);
    }
    if (isMovementDestination) {
      setTimeout(() => {
        setInternalValue(value);
      }, TILE_MOVE_ANIMATION_DURATION - 20); // Slightly earlier to prevent flickering.
    }
    if (creationAnimate) {
      setInternalValue(value);
      void creationAnimate(viewRef.current);
    }
  }, [
    creationAnimate,
    mergeAnimate,
    movementAnimate,
    value,
    updatedAtTimestamp,
    isMovementDestination,
  ]);

  return (
    <TileView
      ref={viewRef}
      value={internalValue}
      backgroundColor={backgroundColor}
      textColor={textColor}
      fontSize={fontSize}
      zIndex={zIndex}
    />
  );
}
