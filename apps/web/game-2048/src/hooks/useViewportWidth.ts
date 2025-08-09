import {useDeferredValue, useEffect, useState} from 'react';

export function useViewportWidth(): number {
  const [width, setWidth] = useState(window.innerWidth);
  const deferredWidth = useDeferredValue(width);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deferredWidth;
}
