import {type Article, type Category} from '@website/classes';
import {message, notification} from 'antd';
import {type ButtonProps} from 'antd';
import {type ModalProps} from 'antd';
import {type PopconfirmProps} from 'antd';
import {type SwitchProps} from 'antd';
import {useRouter} from 'next/router';
import {
    type DOMAttributes,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {Blog} from '@/apis';
import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/config/route';
import {useCategories} from '@/hooks/useCategories';

import {ArticleListView} from './View';

interface IProps {
    categoryIdFilter?: number; // 限定文章的分类
}

export function ArticleList(props: IProps) {
    const {categoryIdFilter} = props;
    const [articleMap, setArticleMap] = useState(new Map<number, Article>());

    const [isArticleLoading, setIsArticleLoading] = useState(false);
    const [loadingArticleId, setLoadingArticleId] = useState(0);

    const [articleInModalTitle, setArticleInModalTitle] = useState('');
    const [articleInModalMarkdown, setArticleInModalMarkdown] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [idOfArticleToDelete, setIdOfArticleToDelete] = useState(0);

    const router = useRouter();

    const {categories, loading: categoriesIsLoading} = useCategories();
    const categoryMap: Map<number, Category> = useMemo(() => {
        const map: Map<number, Category> = new Map();
        if (categories !== null) {
            for (const category of categories) {
                map.set(category.id, category);
            }
        }
        return map;
    }, [categories]);

    useEffect(() => {
        setIsArticleLoading(true);
        void Promise.resolve()
            .then(async () => {
                if (typeof categoryIdFilter === 'undefined') {
                    return await Blog.Article.getAll();
                } else {
                    return await Blog.Article.getByCategory(categoryIdFilter);
                }
            })
            .then((articleList) => {
                if (articleList !== null) {
                    const articleMap: Map<number, Article> = new Map<
                        number,
                        Article
                    >();
                    articleList.forEach((article) => {
                        articleMap.set(article.id, article);
                    });

                    setArticleMap(articleMap);
                }
            })
            .finally(() => {
                setIsArticleLoading(false);
            });
    }, [categoryIdFilter]);

    const modalOnOk: ModalProps['onOk'] = useCallback(() => {
        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen]);

    const modalOnCancel: ModalProps['onCancel'] = useCallback(modalOnOk, [
        modalOnOk,
    ]);

    const onArticleTitleClick: (
        id: number,
    ) => DOMAttributes<HTMLSpanElement>['onClick'] = useCallback(
        (id: number) => {
            return (e) => {
                e.preventDefault();
                const article = articleMap.get(id);
                if (typeof article === 'undefined') {
                    void message.warning('文章不存在');
                } else {
                    setArticleInModalTitle(article.title);
                    setArticleInModalMarkdown(article.content);
                    setModalIsOpen(true);
                }
            };
        },
        [articleMap],
    );

    const onIsVisibleSwitchClick: (id: number) => SwitchProps['onClick'] =
        useCallback(
            (id: number) => {
                return async (checked) => {
                    setLoadingArticleId(id);
                    const result = await Blog.Article.modify({
                        id,
                        isVisible: checked,
                    });
                    if (result !== null) {
                        const article = articleMap.get(id);
                        if (article === undefined) {
                            void message.warning('文章不存在');
                        } else {
                            article.isVisible = checked;
                            setArticleMap(new Map(articleMap));
                            setLoadingArticleId(0);
                        }
                    }
                };
            },
            [articleMap],
        );

    const onModifyArticleButtonClick: (id: number) => ButtonProps['onClick'] =
        useCallback(
            (id: number) => {
                return (e) => {
                    e.preventDefault();
                    const urlSearchParams = new URLSearchParams();
                    urlSearchParams.set('id', id.toString());
                    void router.push(
                        `${
                            PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]
                        }?${urlSearchParams.toString()}`,
                    );
                };
            },
            [router],
        );

    const onDeleteArticleButtonClick: (id: number) => ButtonProps['onClick'] =
        useCallback((id: number) => {
            return () => {
                setIdOfArticleToDelete(id);
            };
        }, []);

    const onDeleteArticleConfirm: PopconfirmProps['onConfirm'] =
        useCallback(() => {
            void Blog.Article.deleteById(idOfArticleToDelete).then((result) => {
                if (result !== null) {
                    notification.success({
                        message: '文章删除成功',
                    });
                    articleMap.delete(idOfArticleToDelete);
                    setArticleMap(new Map(articleMap));
                }
            });
        }, [articleMap, idOfArticleToDelete]);

    return (
        <ArticleListView
            isLoading={categoriesIsLoading || isArticleLoading}
            articleMap={articleMap}
            categoryMap={categoryMap}
            modalIsOpen={modalIsOpen}
            articleInModalTitle={articleInModalTitle}
            articleInModalMarkdown={articleInModalMarkdown}
            modalOnOk={modalOnOk}
            modalOnCancel={modalOnCancel}
            loadingArticleId={loadingArticleId}
            onArticleTitleClick={onArticleTitleClick}
            onIsVisibleSwitchClick={onIsVisibleSwitchClick}
            onModifyArticleButtonClick={onModifyArticleButtonClick}
            onDeleteArticleButtonClick={onDeleteArticleButtonClick}
            onDeleteArticleConfirm={onDeleteArticleConfirm}
        />
    );
}
