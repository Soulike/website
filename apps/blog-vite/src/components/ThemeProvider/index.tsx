import './style.css';

import {useMediaQuery} from '@website/hooks';
import {App, ConfigProvider, theme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {JSX} from 'react';

interface IThemeProviderProps {
  children?: JSX.Element;
}

export function ThemeProvider({children}: IThemeProviderProps) {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
