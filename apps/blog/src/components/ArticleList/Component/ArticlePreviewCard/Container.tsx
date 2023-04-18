import {type Category} from '@website/classes';

import {useMarkdownConverter} from '@/src/hooks/useMarkdownConverter';

import {ArticlePreviewCardView} from './View';

export interface IArticlePreviewCardProps {
    articleId: number;
    articleTitle: string;
    articleTime: Readonly<Date>;
    articleCategory: Readonly<Category> | undefined;
    articleViewAmount: number;
    articleBriefTextMarkdown: string;
}

export function ArticlePreviewCard(props: IArticlePreviewCardProps) {
    const {articleBriefTextMarkdown, ...restProps} = props;

    const {loading, html: articleBriefTextHtml} = useMarkdownConverter(
        articleBriefTextMarkdown
    );

    return (
        <ArticlePreviewCardView
            loading={loading}
            articleBriefTextHtml={articleBriefTextHtml ?? ''}
            {...restProps}
        />
    );
}
