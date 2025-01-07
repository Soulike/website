import {type Article, type Category} from '@website/classes';
import {Blog} from '@website/server-api';
import {
  type ButtonProps,
  message,
  type ModalProps,
  notification,
  type PopconfirmProps,
  type SwitchProps,
} from 'antd';
import {
  type DOMAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useNavigate} from 'react-router';

import {showNetworkError} from '@/helpers/error-notification-helper.js';
import {useCategories} from '@/hooks/useCategories';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

import {ArticleListView} from './view.js';

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

  const navigate = useNavigate();

  const {categories, loading: categoriesIsLoading} = useCategories();
  const categoryMap: Map<number, Category> = useMemo(() => {
    const map = new Map<number, Category>();
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
      .then((response) => {
        if (response.isSuccessful) {
          const {data: articles} = response;
          const articleMap: Map<number, Article> = new Map<number, Article>();
          articles.forEach((article) => {
            articleMap.set(article.id, article);
          });

          setArticleMap(articleMap);
        } else {
          const {message} = response;
          notification.warning({message});
        }
      })
      .catch((err: unknown) => {
        showNetworkError(err);
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
          void message.warning('Article not found');
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
          try {
            setLoadingArticleId(id);
            const response = await Blog.Article.modify({
              id,
              isVisible: checked,
            });
            if (response.isSuccessful) {
              const article = articleMap.get(id);
              if (article === undefined) {
                void message.warning('Article not found');
              } else {
                article.isVisible = checked;
                setArticleMap(new Map(articleMap));
                setLoadingArticleId(0);
              }
            } else {
              const {message} = response;
              notification.warning({message});
            }
          } catch (err) {
            showNetworkError(err);
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
          void navigate(
            `${
              PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]
            }?${urlSearchParams.toString()}`,
          );
        };
      },
      [navigate],
    );

  const onDeleteArticleButtonClick: (id: number) => ButtonProps['onClick'] =
    useCallback((id: number) => {
      return () => {
        setIdOfArticleToDelete(id);
      };
    }, []);

  const onDeleteArticleConfirm: PopconfirmProps['onConfirm'] =
    useCallback(() => {
      void Blog.Article.deleteById(idOfArticleToDelete)
        .then((response) => {
          if (response.isSuccessful) {
            notification.success({
              message: 'Article deleted',
            });
            articleMap.delete(idOfArticleToDelete);
            setArticleMap(new Map(articleMap));
            setIdOfArticleToDelete(0);
          } else {
            const {message} = response;
            notification.warning({message});
          }
        })
        .catch((err: unknown) => {
          showNetworkError(err);
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
