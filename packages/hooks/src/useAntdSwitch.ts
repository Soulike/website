import type {SwitchProps} from 'antd';
import {useCallback, useState} from 'react';

export function useAntdSwitch(defaultChecked = false) {
  const [checked, setChecked] = useState(defaultChecked);

  const onChange: Required<SwitchProps>['onChange'] = useCallback((checked) => {
    setChecked(checked);
  }, []);

  const resetValue = useCallback(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  return {checked, setChecked, onChange, resetValue};
}
