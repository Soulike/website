import 'antd/dist/reset.css';
import '@/src/globalStyle/color.scss';
import '@/src/globalStyle/globalStyle.scss';

import type {Metadata, Viewport} from 'next';
import Script from 'next/script';
import {ReactNode} from 'react';

import {RootLayout} from '@/src/components/RootLayout';

export const metadata: Metadata = {
  title: 'Soulike 的博客',
  description: 'Soulike 的博客.',
  icons: {
    icon: '/favicon.ico',
    apple: '/avatar.png',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    nosnippet: false,
    googleBot: {
      index: true,
      follow: true,
      nocache: false,
      noarchive: false,
      nosnippet: false,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const RootLayoutContainer = ({children}: {children: ReactNode}) => {
  return (
    <html lang='zh-cn'>
      <head>
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
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
};

export default RootLayoutContainer;