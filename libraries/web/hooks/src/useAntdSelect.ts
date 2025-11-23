import type {SelectProps} from 'antd';
import {useCallback, useState} from 'react';

export function useAntdSelect<T>(initialValue?: T) {
  const [value, setValue] = useState<T | null>(initialValue ?? null);

  const onChange: Required<SelectProps<T>>['onChange'] = useCallback(
    (value) => {
      setValue(value);
    },
    [],
  );

  const resetValue = useCallback(() => {
    setValue(initialValue ?? null);
  }, [initialValue]);

  return {value, setValue, onChange, resetValue};
}
