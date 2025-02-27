import './style.css';

import {ColorScheme, useColorScheme} from '@website/hooks';
import {App, ConfigProvider, theme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {JSX} from 'react';

interface IThemeProviderProps {
  children?: JSX.Element;
}

export function ThemeProvider({children}: IThemeProviderProps) {
  const colorScheme = useColorScheme();

  return (
    <ConfigProvider
      locale={zhCN}
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
