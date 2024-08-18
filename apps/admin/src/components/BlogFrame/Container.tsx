'use client';

import {usePathname} from 'next/navigation';
import {type ReactNode} from 'react';

import {BlogFrameView} from './View';

interface Props {
  children: ReactNode;
}

export function BlogFrame(props: Props) {
  const pathname = usePathname();
  const {children} = props;

  return <BlogFrameView pathname={pathname}>{children}</BlogFrameView>;
}
