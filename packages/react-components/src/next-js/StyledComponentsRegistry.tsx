'use client';

import {useServerInsertedHTML} from 'next/navigation';
import React, {useState} from 'react';
import {ServerStyleSheet, StyleSheetManager} from 'styled-components';

interface Props {
  children: React.ReactNode;
}

/**
 * Component for Next.js to support styled-components.
 * @see https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
 */
export function StyledComponentsRegistry({children}: Props) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
