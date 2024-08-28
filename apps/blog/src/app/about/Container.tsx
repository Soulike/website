'use client';

import {useAbout} from '@/src/hooks/useAbout';

import {AboutView} from './View';

export function About() {
  const {loading: aboutIsLoading, about} = useAbout();

  document.title = '关于 - Soulike 的博客';

  return <AboutView aboutMarkdown={about ?? ''} loading={aboutIsLoading} />;
}
