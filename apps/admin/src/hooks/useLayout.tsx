import {useRouter} from 'next/router';
import type React from 'react';
import {type ReactNode} from 'react';

import {ROUTE_PREFIX_TO_LAYOUT} from '@/config/route';

export type IReactFCWithChildren = React.FC<{children: ReactNode}>;

export function useLayout(): IReactFCWithChildren {
    const {pathname} = useRouter();

    for (const urlPrefix of Object.keys(ROUTE_PREFIX_TO_LAYOUT)) {
        if (pathname.startsWith(urlPrefix))
            return ROUTE_PREFIX_TO_LAYOUT[urlPrefix];
    }

    const passThroughComponment: IReactFCWithChildren = ({children}) => (
        <>{children}</>
    );
    return passThroughComponment;
}
