import Head from 'next/head';

import {useAbout} from '@/src/hooks/useAbout';
import {useMarkdownConverter} from '@/src/hooks/useMarkdownConverter';

import {AboutView} from './View';

export function About() {
    const {loading: aboutIsLoading, about} = useAbout();

    const {loading: converterIsLoading, html} = useMarkdownConverter(
        about ?? undefined
    );

    return (
        <>
            <Head>
                <title>关于 - Soulike 的博客</title>
            </Head>
            <AboutView
                aboutHtml={html ?? ''}
                loading={aboutIsLoading || converterIsLoading}
            />
        </>
    );
}
