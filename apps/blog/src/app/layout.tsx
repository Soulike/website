'use client';

import 'antd/dist/reset.css';
import '@/src/globalStyle/color.scss';
import '@/src/globalStyle/globalStyle.scss';

import {AntdRegistry} from '@ant-design/nextjs-registry';
import {useMediaQuery} from '@chakra-ui/media-query';
import {App, ConfigProvider, theme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Script from 'next/script';
import {ReactNode} from 'react';

import {Frame} from '@/src/components/Frame';

const RootLayout = ({children}: {children: ReactNode}) => {
  const [isDarkMode] = useMediaQuery('(prefers-color-scheme: dark)');

  // TODO: use SSR metadata
  return (
    <html lang='zh-cn'>
      <head>
        <meta
          content='width=device-width, initial-scale=1, maximum-scale=1'
          name='viewport'
        />
        <meta name='theme-color' content='#000000' />
        <meta content='index,follow' name='robots' />
        <meta content="Soulike's blog" name='description' />
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link href='https://unpkg.com' rel='preconnect' />
        <link href='https://v1.hitokoto.cn' rel='preconnect' />
        <link
          href='https://www.googletagmanager.com/gtag/js?id=UA-148185792-1'
          rel='prefetch'
        />
        <Script
          src='https://www.googletagmanager.com/gtag/js?id=UA-148185792-1'
          strategy={'lazyOnload'}
        />
        <Script id={'google-analytics'}>
          {`
        window.dataLayer = window.dataLayer || [];

        function gtag()
        {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'UA-148185792-1');
    `}
        </Script>
      </head>
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              algorithm: isDarkMode
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
            }}
          >
            <App>
              <Frame>{children}</Frame>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
