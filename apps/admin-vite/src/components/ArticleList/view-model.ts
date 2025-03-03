import assert from 'node:assert';

import {Article} from '@website/classes';
import {useModalViewModel} from '@website/hooks/dist/useModalViewModel.js';
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
  const articleModel = useMemo(() => new BlogModels.ArticleModel(), []);
  const {
    loading: idToCategoryLoading,
    idToCategory,
    error: idToCategoryError,
  } = BlogModelHooks.CategoryModelHooks.useIdToCategory();

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

  const {
    show: showArticlePreviewModal,
    hide: hideArticlePreviewModal,
    visible: articlePreviewModalVisible,
  } = useModalViewModel();

  const [articlePreviewModalTitle, setArticlePreviewModalTitle] = useState('');
  const [articlePreviewModalContent, setArticlePreviewModalContent] =
    useState('');

  const handleArticleTitleClick: (
    id: Article['id'],
  ) => DOMAttributes<HTMLSpanElement>['onClick'] = useCallback(
    (id: Article['id']) => {
      return (e) => {
        e.preventDefault();
        const article = idToArticle?.get(id);
        if (typeof article === 'undefined') {
          void message.warning('Article not found');
        } else {
          setArticlePreviewModalTitle(article.title);
          setArticlePreviewModalContent(article.content);
          showArticlePreviewModal();
        }
      };
    },
    [
      idToArticle,
      setArticlePreviewModalContent,
      setArticlePreviewModalTitle,
      showArticlePreviewModal,
    ],
  );

  const [processingArticleId, setProcessingArticleId] = useState<
    Article['id'] | null
  >(null);

  const handleIsVisibleSwitchClick: (
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

  const handleDeleteArticleButtonClick: (
    id: Article['id'],
  ) => ButtonProps['onClick'] = useCallback((id: Article['id']) => {
    return () => {
      setProcessingArticleId(id);
    };
  }, []);

  const [deleteArticleLoading, setDeleteArticleLoading] = useState(false);
  const handleDeleteArticleConfirm = useCallback(
    (onSuccess?: () => void, onError?: (error: Error) => void) => {
      if (processingArticleId === null) {
        return;
      }
      setDeleteArticleLoading(true);
      articleModel
        .deleteById(processingArticleId)
        .then(() => {
          assert(idToArticleCache);
          idToArticleCache.delete(processingArticleId);
          setIdToArticleCache(idToArticleCache);
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
          setDeleteArticleLoading(false);
          setProcessingArticleId(null);
        });
    },
    [articleModel, idToArticleCache, processingArticleId],
  );

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
    articlePreviewModalContent,
    processingArticleId,
    handleArticleTitleClick,
    handleIsVisibleSwitchClick,
    deleteArticleLoading,
    handleDeleteArticleButtonClick,
    handleDeleteArticleConfirm,
  };
}
