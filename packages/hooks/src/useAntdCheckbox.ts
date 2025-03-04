import type {CheckboxProps} from 'antd';
import {useCallback, useState} from 'react';

export function useAntdCheckbox(defaultChecked = false) {
  const [checked, setChecked] = useState(defaultChecked);

  const onChange: Required<CheckboxProps>['onChange'] = useCallback((e) => {
    setChecked(e.target.checked);
  }, []);

  const resetValue = useCallback(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  return {checked, onChange, resetValue};
}
