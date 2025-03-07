import assert from 'node:assert';

import {Category} from '@website/classes';
import {BlogModels} from '@website/model';
import {BlogModelHooks} from '@website/model/react';
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
    idToArticleAmount,
    loading: idToArticleAmountLoading,
    error: idToArticleAmountLoadError,
  } = BlogModelHooks.CategoryModelHooks.useIdToArticleAmount();

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
    });

  return {
    idToCategory: idToCategoryCache,
    idToCategoryLoading,
    idToCategoryLoadError,
    idToArticleAmountLoading,
    idToArticleAmountLoadError,
    idToArticleAmount,
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
) {
  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);
  const [submitting, setSubmitting] = useState(false);
  const handleCategoryDeletion = useCallback(
    (id: Category['id'], onError: (e: unknown) => void) => {
      setSubmitting(true);
      categoryModel
        .deleteById(id)
        .then(() => {
          afterSubmitSuccess(id);
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
    handleCategoryDeletion,
  };
}
