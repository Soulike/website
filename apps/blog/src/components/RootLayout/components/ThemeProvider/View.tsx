'use client';

import './theme/default.css';
import './theme/dark.css';

import {AntdRegistry} from '@ant-design/nextjs-registry';
import {useMediaQuery} from '@chakra-ui/media-query';
import {StyledComponentsRegistry} from '@website/react-components/next-js';
import {App, ConfigProvider, theme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React, {useEffect, useState} from 'react';

import style from './style.module.scss';

interface IThemeProviderProps {
  children?: React.ReactNode;
}

export function ThemeProvider({children}: IThemeProviderProps) {
  const [isDarkMode] = useMediaQuery('(prefers-color-scheme: dark)');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <StyledComponentsRegistry>
      <AntdRegistry>
        <ConfigProvider
          locale={zhCN}
          theme={{
            algorithm: isDarkMode
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
            cssVar: true,
          }}
        >
          <App>
            <div
              className={`${style.container} ${isVisible ? style.visible : ''}`}
            >
              {children}
            </div>
          </App>
        </ConfigProvider>
      </AntdRegistry>
    </StyledComponentsRegistry>
  );
}
