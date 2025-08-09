import {useDeferredValue, useEffect, useState} from 'react';

export function useViewportHeight(): number {
  const [height, setHeight] = useState(window.innerHeight);
  const deferredHeight = useDeferredValue(height);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deferredHeight;
}
