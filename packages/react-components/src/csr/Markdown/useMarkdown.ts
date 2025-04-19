import {useCallback, useState} from 'react';

export function useMarkdown() {
  const [rendering, setRendering] = useState(false);

  const onRenderStart = useCallback(() => {
    setRendering(true);
  }, []);

  const onRenderFinish = useCallback(() => {
    setRendering(false);
  }, []);

  return {
    rendering,
    onRenderStart,
    onRenderFinish,
  };
}
