import {type Article} from '@website/classes';
import {useEffect, useState} from 'react';

import {Blog} from '@/apis';

const {Article: ArticleApi} = Blog;

export function useArticles(categoryId?: number): {
    loading: boolean;
    articles: Article[] | null;
} {
    const [articles, setArticles] = useState<Article[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setArticles(null);

        if (categoryId !== undefined && isNaN(categoryId)) {
            setLoading(false);
            return;
        }

        const promise =
            categoryId === undefined
                ? ArticleApi.getAll()
                : ArticleApi.getByCategory(categoryId);

        void promise
            .then((articles) => {
                setArticles(articles);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [categoryId]);

    return {loading, articles};
}
