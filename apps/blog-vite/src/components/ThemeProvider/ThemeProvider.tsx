import './style.css';

import {ColorScheme, useColorScheme} from '@website/hooks';
import {App, ConfigProvider, theme} from 'antd';
import {JSX} from 'react';

interface IThemeProviderProps {
  children?: JSX.Element;
}

export function ThemeProvider({children}: IThemeProviderProps) {
  const colorScheme = useColorScheme();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          colorScheme == ColorScheme.LIGHT
            ? theme.defaultAlgorithm
            : theme.darkAlgorithm,
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
