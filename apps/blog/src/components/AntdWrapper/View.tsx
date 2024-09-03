'use client';

import {AntdRegistry} from '@ant-design/nextjs-registry';
import {useMediaQuery} from '@chakra-ui/media-query';
import {App, ConfigProvider, theme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type React from 'react';

interface IAntdWrapperProps {
  children?: React.ReactNode;
}

/**
 * ConfigProvider can not provide config across CSR and SSR boundaries.
 * So wrap it around CSR components which are children of SSR components.
 */
export function AntdWrapper({children}: IAntdWrapperProps) {
  const [isDarkMode] = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          cssVar: true,
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
