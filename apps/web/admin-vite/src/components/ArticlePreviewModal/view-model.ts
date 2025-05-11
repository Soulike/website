import {useCallback, useState} from 'react';

export function useViewModel() {
  const [isMarkdownRendering, setIsMarkdownRendering] = useState(false);

  const onMarkdownRenderStart = useCallback(() => {
    setIsMarkdownRendering(true);
  }, []);

  const onMarkdownRenderFinish = useCallback(() => {
    setIsMarkdownRendering(false);
  }, []);

  return {
    isMarkdownRendering,
    onMarkdownRenderStart,
    onMarkdownRenderFinish,
  };
}
