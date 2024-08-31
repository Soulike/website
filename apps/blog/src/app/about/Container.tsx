'use client';

import {AntdWrapper} from '@/src/components/AntdWrapper';
import {useAbout} from '@/src/hooks/useAbout';

import {AboutView} from './View';

export function About() {
  const {loading: aboutIsLoading, about} = useAbout();

  document.title = '关于 - Soulike 的博客';

  return (
    <AntdWrapper>
      <AboutView aboutMarkdown={about ?? ''} loading={aboutIsLoading} />
    </AntdWrapper>
  );
}
