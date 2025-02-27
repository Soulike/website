import {useEffect, useState} from 'react';

// TODO: Use AI to generate abstract
export function useMarkdownAbstract(markdown: string) {
  const [loading, setLoading] = useState(true);
  const [abstract, setAbstract] = useState('');

  useEffect(() => {
    setLoading(true);
    const abstract = markdown.split('\n')[0];
    setAbstract(abstract);
    setLoading(false);
  }, [markdown]);

  return {loading, abstract};
}
