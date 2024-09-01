import type {Metadata} from 'next';

import {getAboutMarkdown} from '@/src/app/about/AboutViewModel';

import {AboutView} from './View';

export const metadata: Metadata = {
  title: '关于 - Soulike 的博客',
};

export async function About() {
  const aboutMarkdown = await getAboutMarkdown();

  return <AboutView aboutMarkdown={aboutMarkdown} />;
}
