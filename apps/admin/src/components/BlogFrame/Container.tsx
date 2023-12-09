import {useRouter} from 'next/router';
import {type ReactNode} from 'react';

import {BlogFrameView} from './View';

interface Props {
    children: ReactNode;
}

export function BlogFrame(props: Props) {
    const {pathname} = useRouter();
    const {children} = props;

    return <BlogFrameView pathname={pathname}>{children}</BlogFrameView>;
}
