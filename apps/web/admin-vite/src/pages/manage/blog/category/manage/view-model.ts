import assert from 'node:assert';

import {BlogModels} from '@module/model/admin';
import {BlogModelHooks} from '@module/model/react/admin';
import {type Category} from '@schema/blog';
import {useCallback, useMemo, useState} from 'react';

type CategoryModelType = InstanceType<typeof BlogModels.CategoryModel>;
type CategoryModelModifyParameters = Parameters<CategoryModelType['modify']>;

export function useViewModel() {
  const {
    idToCategoryCache,
    updateIdToCategoryCache,
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
    updateIdToCategoryCache((prev) => {
      assert(prev);
      const modifiedCategory = prev.get(id);
      assert(modifiedCategory);
      const next = new Map(prev);
      next.set(id, {...modifiedCategory, ...modifiedParts});
      return next;
    });
  });

  const {submitting: categoryDeletionSubmitting, handleCategoryDeletion} =
    useSubmitCategoryDeletion((id) => {
      updateIdToCategoryCache((prev) => {
        assert(prev);
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
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
  const [overriddenState, setOverriddenState] = useState<{
    source: Map<Category['id'], Category> | null;
    value: Map<Category['id'], Category> | null;
  } | null>(null);

  const idToCategoryCache =
    overriddenState !== null && overriddenState.source === idToCategory
      ? overriddenState.value
      : error
        ? null
        : idToCategory;

  const updateIdToCategoryCache = useCallback(
    (
      updater: (
        prev: Map<Category['id'], Category> | null,
      ) => Map<Category['id'], Category> | null,
    ) => {
      setOverriddenState((prevOverride) => {
        const current =
          prevOverride !== null && prevOverride.source === idToCategory
            ? prevOverride.value
            : error
              ? null
              : idToCategory;
        return {
          source: idToCategory,
          value: updater(current),
        };
      });
    },
    [error, idToCategory],
  );

  return {
    idToCategoryCache,
    updateIdToCategoryCache,
    loading,
    error,
  };
}

function useIdToArticleAmountCache() {
  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);
  const {idToArticleAmount, loading, error} =
    BlogModelHooks.CategoryModelHooks.useIdToArticleAmount();
  const [overriddenState, setOverriddenState] = useState<{
    source: Map<Category['id'], number> | null;
    value: Map<Category['id'], number> | null;
  } | null>(null);

  const idToArticleAmountCache =
    overriddenState !== null && overriddenState.source === idToArticleAmount
      ? overriddenState.value
      : error
        ? null
        : idToArticleAmount;

  const updateIdToArticleAmountCache = useCallback(
    (
      updater: (
        prev: Map<Category['id'], number> | null,
      ) => Map<Category['id'], number> | null,
    ) => {
      setOverriddenState((prevOverride) => {
        const current =
          prevOverride !== null && prevOverride.source === idToArticleAmount
            ? prevOverride.value
            : error
              ? null
              : idToArticleAmount;
        return {
          source: idToArticleAmount,
          value: updater(current),
        };
      });
    },
    [error, idToArticleAmount],
  );

  const setCategoryArticleAmount = useCallback(
    (id: Category['id'], articleAmount: number) => {
      updateIdToArticleAmountCache((prev) => {
        if (!prev) {
          return prev;
        }
        const next = new Map(prev);
        next.set(id, articleAmount);
        return next;
      });
    },
    [updateIdToArticleAmountCache],
  );

  const deleteCategoryArticleAmount = useCallback(
    (id: Category['id']) => {
      updateIdToArticleAmountCache((prev) => {
        if (!prev) {
          return prev;
        }
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    },
    [updateIdToArticleAmountCache],
  );

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
