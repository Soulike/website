import {useCallback, useState} from 'react';

export enum ModalState {
  HIDDEN = 'hidden',
  VISIBLE = 'visible',
}

export function useModalViewModel(initState: ModalState = ModalState.HIDDEN) {
  const [state, setState] = useState(initState);

  const show = useCallback(() => {
    setState(ModalState.VISIBLE);
  }, []);

  const hide = useCallback(() => {
    setState(ModalState.HIDDEN);
  }, []);

  return {
    visible: state === ModalState.VISIBLE,
    show,
    hide,
  };
}
