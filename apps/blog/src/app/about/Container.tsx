import {getAboutMarkdown} from '@/src/app/about/AboutViewModel';

import {AboutView} from './View';

export async function About() {
  const aboutMarkdown = await getAboutMarkdown();

  return <AboutView aboutMarkdown={aboutMarkdown} />;
}
