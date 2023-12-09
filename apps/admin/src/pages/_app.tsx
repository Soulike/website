import 'antd/dist/reset.css';
import '@/pages/_app.scss';

import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {Suspense} from 'react';

import {Loading} from '@/components/Loading';
import {useLayout} from '@/hooks/useLayout';

export default function App({Component, pageProps}: AppProps) {
    const Layout = useLayout();
    return (
        <>
            <Suspense fallback={<Loading />}>
                <ConfigProvider locale={zhCN}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ConfigProvider>
            </Suspense>
            <Head>
                <title>Admin</title>
                <link rel='icon' href='/favicon.ico' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <meta name='theme-color' content='#000000' />
                <meta
                    content='noindex,nofollow,noarchive,nosnippet'
                    name='robots'
                />
                <meta content='My admin app' name='description' />
                <link href='https://unpkg.com' rel='preconnect' />
                <link href='avatar.png' rel='apple-touch-icon' />
            </Head>
        </>
    );
}
