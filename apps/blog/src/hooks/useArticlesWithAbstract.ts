import {type Article} from '@website/classes';
import {useEffect, useState} from 'react';

import {Article as ArticleApi} from '@/src/apis';

export function useArticlesWithAbstract(categoryId?: number): {
    loading: boolean;
    articlesWithAbstract: Article[] | null;
} {
    const [articlesWithAbstract, setArticlesWithAbstract] = useState<
        Article[] | null
    >(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setArticlesWithAbstract(null);

        if (categoryId !== undefined && isNaN(categoryId)) {
            setLoading(false);
            return;
        }

        const promise =
            categoryId === undefined
                ? ArticleApi.getAllWithAbstract()
                : ArticleApi.getByCategoryWithAbstract(categoryId);

        void promise
            .then((articlesWithAbstract) => {
                setArticlesWithAbstract(articlesWithAbstract);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [categoryId]);

    return {loading, articlesWithAbstract};
}
