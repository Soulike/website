import Head from 'next/head';

import {useAbout} from '@/src/hooks/useAbout';

import {AboutView} from './View';

export function About() {
    const {loading: aboutIsLoading, about} = useAbout();

    return (
        <>
            <Head>
                <title>关于 - Soulike 的博客</title>
            </Head>
            <AboutView aboutMarkdown={about ?? ''} loading={aboutIsLoading} />
        </>
    );
}
