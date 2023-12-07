import {type ReactNode} from 'react';

import {BlogFrame} from '@/components/BlogFrame';
import {Frame} from '@/components/Frame';

import {PAGE_ID} from './PAGE_ID';
import {PAGE_ID_TO_ROUTE} from './PAGE_ID_TO_ROUTE';

// Longer route first
export const ROUTE_PREFIX_TO_LAYOUT: Readonly<
    Record<string, React.FC<{children: ReactNode}>>
> = Object.freeze({
    [PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.INDEX]]: ({children}) => (
        <Frame>
            <BlogFrame>{children}</BlogFrame>
        </Frame>
    ),
    [PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX]]: ({children}) => (
        <Frame>{children}</Frame>
    ),
});
