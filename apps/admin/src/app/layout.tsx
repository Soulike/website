import 'antd/dist/reset.css';
import '@/app/global-styles.scss';

import {AntdRegistry} from '@ant-design/nextjs-registry';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type {Metadata, Viewport} from 'next';
import React, {ReactNode} from 'react';

export const metadata: Metadata = {
  title: 'Website Admin Site',
  description: 'Website admin site.',
  icons: {
    icon: '/favicon.ico',
    apple: '/avatar.png',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const RootLayout = ({children}: {children: ReactNode}) => (
  <html lang='zh-cn'>
    <head>
      <link href='https://unpkg.com' rel='preconnect' />
    </head>
    <body>
      <AntdRegistry>
        <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
