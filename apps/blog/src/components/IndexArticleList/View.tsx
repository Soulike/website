import {type Article} from '@website/classes';

import {ArticleList} from '../ArticleList';
import Style from './Style.module.scss';

interface Props {
    loading: boolean;
    articleList: Article[];
}

export function IndexArticleList(props: Props) {
    const {loading, articleList} = props;
    return (
        <div className={Style.IndexArticleList}>
            <ArticleList loading={loading} articleList={articleList} />
        </div>
    );
}
