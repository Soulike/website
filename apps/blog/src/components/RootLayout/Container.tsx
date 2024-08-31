'use client';

import {AntdRegistry} from '@ant-design/nextjs-registry';
import {useMediaQuery} from '@chakra-ui/media-query';
import {App, ConfigProvider, theme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type React from 'react';

import {useCategories} from '@/src/hooks/useCategories';
import {useCurrentYear} from '@/src/hooks/useCurrentYear';
import {useHitokoto} from '@/src/hooks/useHitokoto';

import {RootLayoutView} from './View';

export interface IRootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout(props: IRootLayoutProps) {
  const {children} = props;

  // 设定当前年份
  const year = useCurrentYear();

  // 设定 hitokoto
  const hitokoto = useHitokoto();

  const [isDarkMode] = useMediaQuery('(prefers-color-scheme: dark)');

  // 获取所有分类
  const {loading, categories} = useCategories();

  return (
    <AntdRegistry>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <App>
          <RootLayoutView
            loading={loading}
            hitokoto={hitokoto}
            year={year}
            categories={categories ?? []}
          >
            {children}
          </RootLayoutView>
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
