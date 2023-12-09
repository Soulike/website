import {IndexArticleList} from '@/src/components/IndexArticleList';
import {useArticlesWithAbstract} from '@/src/hooks/useArticlesWithAbstract';
import {useSearchParam} from '@/src/hooks/useSearchParam';

export function Category() {
    const [id] = useSearchParam('id');
    const categoryId = Number.parseInt(id ?? '');

    const {loading, articlesWithAbstract} = useArticlesWithAbstract(categoryId);

    return (
        <IndexArticleList
            articleList={articlesWithAbstract ?? []}
            loading={loading}
        />
    );
}
