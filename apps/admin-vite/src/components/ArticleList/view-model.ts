import assert from 'node:assert';

import {Article} from '@website/classes';
import {useModal} from '@website/hooks';
import {BlogModels} from '@website/model';
import {BlogModelHooks} from '@website/model/react';
import {type ButtonProps, message, type SwitchProps} from 'antd';
import {
  type DOMAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export function useViewModel(category?: Article['category']) {
  const {
    loading: idToCategoryLoading,
    idToCategory,
    error: idToCategoryError,
  } = BlogModelHooks.CategoryModelHooks.useIdToCategory();

  const {
    idToArticleCache,
    idToArticleLoading,
    idToArticleError,
    setIdToArticleCache,
  } = useIdToArticleCache(category);

  const {
    show: showArticlePreviewModal,
    hide: hideArticlePreviewModal,
    visible: articlePreviewModalVisible,
    title: articlePreviewModalTitle,
    setTitle: setArticlePreviewModalTitle,
    contentInMarkdown: articlePreviewModalContentInMarkdown,
    setContentInMarkdown: setArticlePreviewModalContentInMarkdown,
  } = useArticlePreviewModalViewModel();

  const articleTitleClickHandlerFactory: (
    id: Article['id'],
  ) => DOMAttributes<HTMLSpanElement>['onClick'] = useCallback(
    (id: Article['id']) => {
      return (e) => {
        e.preventDefault();
        const article = idToArticleCache?.get(id);
        if (typeof article === 'undefined') {
          void message.warning('Article not found');
        } else {
          setArticlePreviewModalTitle(article.title);
          setArticlePreviewModalContentInMarkdown(article.content);
          showArticlePreviewModal();
        }
      };
    },
    [
      idToArticleCache,
      setArticlePreviewModalTitle,
      setArticlePreviewModalContentInMarkdown,
      showArticlePreviewModal,
    ],
  );

  const {processingArticleId, isVisibleSwitchClickHandlerFactory} =
    useArticleIsVisibleSwitchViewModel();

  const {
    deletePending: deleteArticlePending,
    deleteArticleButtonClickHandlerFactory,
    handleDeleteArticleConfirm,
  } = useArticleDeleteButtonViewModel(idToArticleCache, setIdToArticleCache);

  return {
    idToCategory,
    idToCategoryLoading,
    idToCategoryError,
    idToArticle: idToArticleCache,
    idToArticleLoading,
    idToArticleError,
    articlePreviewModalVisible,
    hideArticlePreviewModal,
    articlePreviewModalTitle,
    articlePreviewModalContentInMarkdown,
    processingArticleId,
    articleTitleClickHandlerFactory,
    isVisibleSwitchClickHandlerFactory,
    deleteArticlePending,
    deleteArticleButtonClickHandlerFactory,
    handleDeleteArticleConfirm,
  };
}

function useIdToArticleCache(category?: Article['category']) {
  // Maintain a cached version for quick refresh
  const [idToArticleCache, setIdToArticleCache] = useState<Map<
    Article['id'],
    Article
  > | null>(null);
  const {
    loading: idToArticleLoading,
    idToArticle,
    error: idToArticleError,
  } = BlogModelHooks.ArticleModelHooks.useIdToArticle(category);
  useEffect(() => {
    if (!idToArticleLoading && !idToArticleError) {
      setIdToArticleCache(idToArticle);
    }
  }, [idToArticle, idToArticleError, idToArticleLoading]);

  return {
    idToArticleCache,
    setIdToArticleCache,
    idToArticleLoading,
    idToArticleError,
  };
}

function useArticlePreviewModalViewModel() {
  const {show, hide, visible} = useModal();

  const [title, setTitle] = useState('');
  const [contentInMarkdown, setContentInMarkdown] = useState('');

  return {
    show,
    hide,
    visible,
    title,
    setTitle,
    contentInMarkdown,
    setContentInMarkdown,
  };
}

function useArticleIsVisibleSwitchViewModel() {
  const articleModel = useMemo(() => new BlogModels.ArticleModel(), []);
  const [processingArticleId, setProcessingArticleId] = useState<
    Article['id'] | null
  >(null);

  const isVisibleSwitchClickHandlerFactory: (
    id: Article['id'],
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => SwitchProps['onClick'] = useCallback(
    (
      id: Article['id'],
      onSuccess?: () => void,
      onError?: (error: Error) => void,
    ) => {
      return (checked) => {
        setProcessingArticleId(id);
        articleModel
          .modify(id, {isVisible: checked})
          .then(() => {
            setProcessingArticleId(null);
            if (onSuccess) {
              onSuccess();
            }
          })
          .catch((e: unknown) => {
            if (onError) {
              assert(e instanceof Error);
              onError(e);
            }
          });
      };
    },
    [articleModel],
  );

  return {
    processingArticleId,
    isVisibleSwitchClickHandlerFactory,
  };
}

function useArticleDeleteButtonViewModel(
  idToArticleCache: Map<Article['id'], Article> | null,
  setIdToArticleCache: (idToArticleCache: Map<Article['id'], Article>) => void,
) {
  const articleModel = useMemo(() => new BlogModels.ArticleModel(), []);
  const [deletingArticleId, setDeletingArticleId] = useState<
    Article['id'] | null
  >(null);
  const [deletePending, setDeletePending] = useState(false);

  const deleteArticleButtonClickHandlerFactory: (
    id: Article['id'],
  ) => ButtonProps['onClick'] = useCallback((id: Article['id']) => {
    return () => {
      setDeletingArticleId(id);
    };
  }, []);

  const handleDeleteArticleConfirm = useCallback(
    (onSuccess?: () => void, onError?: (error: Error) => void) => {
      if (deletingArticleId === null) {
        return;
      }
      setDeletePending(true);
      articleModel
        .deleteById(deletingArticleId)
        .then(() => {
          if (idToArticleCache) {
            idToArticleCache.delete(deletingArticleId);
            setIdToArticleCache(idToArticleCache);
          }
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch((error: unknown) => {
          assert(error instanceof Error);
          if (onError) {
            onError(error);
          }
        })
        .finally(() => {
          setDeletePending(false);
          setDeletingArticleId(null);
        });
    },
    [articleModel, idToArticleCache, deletingArticleId, setIdToArticleCache],
  );

  return {
    deletePending,
    deletingArticleId,
    deleteArticleButtonClickHandlerFactory,
    handleDeleteArticleConfirm,
  };
}
