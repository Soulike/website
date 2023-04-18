import {useMediaQuery} from '@chakra-ui/media-query';
import {useRouter} from 'next/router';
import type React from 'react';
import {useMemo} from 'react';

import {useCategories} from '@/src/hooks/useCategories';
import {useCurrentYear} from '@/src/hooks/useCurrentYear';
import {useHitokoto} from '@/src/hooks/useHitokoto';

import {FrameView} from './View';

export interface IFrameProps {
    children?: React.ReactNode;
}

export function Frame(props: IFrameProps) {
    const {children} = props;
    const router = useRouter();
    const [isDarkMode] = useMediaQuery('(prefer-color-scheme: dark)');

    // 设定当前年份
    const year = useCurrentYear();

    // 设定 hitokoto
    const hitokoto = useHitokoto();

    // 获取所有分类
    const {loading: categoriesIsLoading, categories} = useCategories();

    const loading = useMemo(
        () => categoriesIsLoading || !router.isReady,
        [categoriesIsLoading, router.isReady]
    );

    return (
        <FrameView
            isDarkMode={isDarkMode}
            loading={loading}
            hitokoto={hitokoto}
            year={year}
            categories={categories ?? []}
        >
            {children}
        </FrameView>
    );
}
