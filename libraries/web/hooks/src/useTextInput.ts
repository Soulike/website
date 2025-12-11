import type {ChangeEventHandler} from 'react';
import {useCallback, useState} from 'react';

export function useTextInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    useCallback((e) => {
      setValue(e.target.value);
    }, []);

  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {value, setValue, onChange, resetValue};
}
