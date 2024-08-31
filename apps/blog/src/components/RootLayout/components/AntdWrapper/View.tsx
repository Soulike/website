'use client';

import {AntdRegistry} from '@ant-design/nextjs-registry';
import {useMediaQuery} from '@chakra-ui/media-query';
import {App, ConfigProvider, theme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type React from 'react';

interface IAntdWrapperProps {
  children?: React.ReactNode;
}

export function AntdWrapper({children}: IAntdWrapperProps) {
  const [isDarkMode] = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
