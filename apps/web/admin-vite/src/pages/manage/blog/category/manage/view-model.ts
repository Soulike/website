import assert from 'node:assert';

import {BlogModels} from '@module/model/admin';
import {BlogModelHooks} from '@module/model/react/admin';
import {type Category} from '@schema/blog';
import {useCallback, useEffect, useMemo, useState} from 'react';

type CategoryModelType = InstanceType<typeof BlogModels.CategoryModel>;
type CategoryModelModifyParameters = Parameters<CategoryModelType['modify']>;

export function useViewModel() {
  const {
    idToCategoryCache,
    setIdToCategoryCache,
    loading: idToCategoryLoading,
    error: idToCategoryLoadError,
  } = useIdToCategoryCache();

  const {
    idToArticleAmountCache,
    setCategoryArticleAmount,
    refreshCategoryArticleAmount,
    deleteCategoryArticleAmount,
    loading: idToArticleAmountLoading,
    error: idToArticleAmountLoadError,
  } = useIdToArticleAmountCache();

  const {
    submitting: categoryModificationSubmitting,
    handleCategoryModificationSubmit,
  } = useSubmitCategoryModification((id, modifiedParts) => {
    // Modify local record instead of request again.
    assert(idToCategoryCache);
    const modifiedCategory = idToCategoryCache.get(id);
    assert(modifiedCategory);
    Object.assign(modifiedCategory, modifiedParts);
    setIdToCategoryCache(new Map(idToCategoryCache));
  });

  const {submitting: categoryDeletionSubmitting, handleCategoryDeletion} =
    useSubmitCategoryDeletion((id) => {
      assert(idToCategoryCache);
      idToCategoryCache.delete(id);
      setIdToCategoryCache(new Map(idToCategoryCache));
      deleteCategoryArticleAmount(id);
    }, setCategoryArticleAmount);

  return {
    idToCategory: idToCategoryCache,
    idToCategoryLoading,
    idToCategoryLoadError,
    idToArticleAmountLoading,
    idToArticleAmountLoadError,
    idToArticleAmount: idToArticleAmountCache,
    refreshCategoryArticleAmount,
    handleCategoryModificationSubmit,
    categoryModificationSubmitting,
    handleCategoryDeletion,
    categoryDeletionSubmitting,
  };
}

function useIdToCategoryCache() {
  const {idToCategory, loading, error} =
    BlogModelHooks.CategoryModelHooks.useIdToCategory();
  const [idToCategoryCache, setIdToCategoryCache] = useState<
    typeof idToCategory | null
  >(null);

  useEffect(() => {
    if (!loading && !error) {
      setIdToCategoryCache(idToCategory);
    }
  }, [error, idToCategory, loading]);

  return {
    idToCategoryCache,
    setIdToCategoryCache,
    loading,
    error,
  };
}

function useIdToArticleAmountCache() {
  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);
  const {idToArticleAmount, loading, error} =
    BlogModelHooks.CategoryModelHooks.useIdToArticleAmount();
  const [idToArticleAmountCache, setIdToArticleAmountCache] = useState<
    typeof idToArticleAmount | null
  >(null);

  useEffect(() => {
    if (!loading && !error) {
      setIdToArticleAmountCache(idToArticleAmount);
    }
  }, [error, idToArticleAmount, loading]);

  const setCategoryArticleAmount = useCallback(
    (id: Category['id'], articleAmount: number) => {
      setIdToArticleAmountCache((prev) => {
        if (!prev) {
          return prev;
        }
        const next = new Map(prev);
        next.set(id, articleAmount);
        return next;
      });
    },
    [],
  );

  const deleteCategoryArticleAmount = useCallback((id: Category['id']) => {
    setIdToArticleAmountCache((prev) => {
      if (!prev) {
        return prev;
      }
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const refreshCategoryArticleAmount = useCallback(
    (id: Category['id']) => {
      categoryModel
        .getArticleAmountById(id)
        .then((articleAmount) => {
          setCategoryArticleAmount(id, articleAmount);
        })
        .catch((refreshError: unknown) => {
          console.error(refreshError);
        });
    },
    [categoryModel, setCategoryArticleAmount],
  );

  return {
    idToArticleAmountCache,
    setCategoryArticleAmount,
    refreshCategoryArticleAmount,
    deleteCategoryArticleAmount,
    loading,
    error,
  };
}

function useSubmitCategoryModification(
  afterSubmitSuccess: (
    id: Category['id'],
    modifiedParts: CategoryModelModifyParameters[1],
  ) => void,
) {
  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);
  const [submitting, setSubmitting] = useState(false);
  const handleCategoryModificationSubmit = useCallback(
    (
      id: CategoryModelModifyParameters[0],
      modifiedParts: CategoryModelModifyParameters[1],
      onSuccess: typeof afterSubmitSuccess,
      onError: (e: unknown) => void,
    ) => {
      setSubmitting(true);
      categoryModel
        .modify(id, modifiedParts)
        .then(() => {
          onSuccess(id, modifiedParts);
          afterSubmitSuccess(id, modifiedParts);
        })
        .catch(onError)
        .finally(() => {
          setSubmitting(false);
        });
    },
    [afterSubmitSuccess, categoryModel],
  );

  return {
    submitting,
    handleCategoryModificationSubmit,
  };
}

function useSubmitCategoryDeletion(
  afterSubmitSuccess: (id: Category['id']) => void,
  onInUseDetected: (id: Category['id'], articleAmount: number) => void,
) {
  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);
  const [submitting, setSubmitting] = useState(false);
  const handleCategoryDeletion = useCallback(
    (
      id: Category['id'],
      onInUse: (articleAmount: number) => void,
      onError: (e: unknown) => void,
    ) => {
      setSubmitting(true);
      categoryModel
        .getArticleAmountById(id)
        .then((articleAmount) => {
          if (articleAmount !== 0) {
            onInUseDetected(id, articleAmount);
            onInUse(articleAmount);
            return;
          }
          return categoryModel.deleteById(id).then(() => {
            afterSubmitSuccess(id);
          });
        })
        .catch(onError)
        .finally(() => {
          setSubmitting(false);
        });
    },
    [afterSubmitSuccess, categoryModel, onInUseDetected],
  );

  return {
    submitting,
    handleCategoryDeletion,
  };
}
