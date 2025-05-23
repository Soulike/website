import assert from 'node:assert';

import {CategoryModel} from '@models/admin/blog/category-model.js';
import {Category, CategoryIdToArticleAmount} from '@website/classes';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';
import {useEffect, useMemo, useState} from 'react';

const categoryModel = new CategoryModel();

export const CategoryModelHooks = Object.freeze({
  useAllCategories,
  useCategoryById,
  useIdToCategory,
  useArticleAmountGroupedById,
  useIdToArticleAmount,
});

function useAllCategories(
  onSuccess?: ResolveCallback<Category[]>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(() => categoryModel.getAll(), []);
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    categories: resolvedValue,
  };
}

function useCategoryById(
  id: Category['id'],
  onSuccess?: ResolveCallback<Category>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(() => categoryModel.getById(id), [id]);
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    category: resolvedValue,
  };
}

function useIdToCategory(
  onSuccess?: ResolveCallback<Map<Category['id'], Category>>,
  onReject?: RejectCallback,
) {
  const {loading, error, categories} = useAllCategories();
  const [idToCategory, setIdToCategory] = useState<Map<
    Category['id'],
    Category
  > | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      if (onReject) {
        void onReject(error);
      }
      return;
    }

    assert(categories);
    const idToCategory = new Map<Category['id'], Category>();
    for (const category of categories) {
      idToCategory.set(category.id, category);
    }
    setIdToCategory(idToCategory);
    void onSuccess?.(idToCategory);
  }, [loading, error, onReject, categories]);

  return {
    loading,
    error,
    idToCategory,
  };
}

function useArticleAmountGroupedById(
  onSuccess?: ResolveCallback<CategoryIdToArticleAmount>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(
    () => categoryModel.getArticleAmountGroupedById(),
    [],
  );
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    articleAmountGroupedById: resolvedValue,
  };
}

function useIdToArticleAmount(
  onSuccess?: ResolveCallback<CategoryIdToArticleAmount>,
  onReject?: RejectCallback,
) {
  const {loading, error, articleAmountGroupedById} =
    useArticleAmountGroupedById(onSuccess, onReject);

  const idToArticleAmount: Map<Category['id'], number> | null = useMemo(() => {
    if (loading || error || !articleAmountGroupedById) {
      return null;
    }

    const idToArticleAmount = new Map<Category['id'], number>();
    const entries = Object.entries(articleAmountGroupedById);
    for (const entry of entries) {
      idToArticleAmount.set(Number.parseInt(entry[0]), entry[1]);
    }
    return idToArticleAmount;
  }, [articleAmountGroupedById, error, loading]);

  return {
    loading,
    error,
    idToArticleAmount,
  };
}
