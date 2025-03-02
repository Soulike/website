import {ChangeEventHandler, useCallback, useState} from 'react';

export function useTextInputViewModel(initialValue = '') {
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
