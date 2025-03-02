import assert from 'node:assert';

import {Category} from '@website/classes';
import {BlogModels} from '@website/model';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {useCategories} from '@/hooks/useCategories.js';
import {useArticleAmountGroupedById} from '@/hooks/useCategoryToArticleAmount.js';

type CategoryModelType = InstanceType<typeof BlogModels.CategoryModel>;
type CategoryModelModifyParameters = Parameters<CategoryModelType['modify']>;

export function useViewModel() {
  const {
    loading: categoriesLoading,
    error: categoriesError,
    categories,
  } = useCategories();

  const [idToCategory, setIdToCategory] = useState<Map<
    Category['id'],
    Category
  > | null>(null);

  useEffect(() => {
    if (categories) {
      const idToCategory = new Map<number, Category>();
      idToCategory.forEach((category) => {
        idToCategory.set(category.id, category);
      });
      setIdToCategory(idToCategory);
    }
  }, [categories]);

  const [categoryIdToArticleAmount, setCategoryIdToArticleAmount] =
    useState<Map<Category['id'], number> | null>(null);
  const {
    loading: articleAmountGroupedByIdLoading,
    error: articleAmountGroupedByIdError,
    articleAmountGroupedById,
  } = useArticleAmountGroupedById();

  useEffect(() => {
    if (articleAmountGroupedById) {
      const categoryIdToArticleAmount = new Map<Category['id'], number>();
      const entries = Object.entries(articleAmountGroupedById);
      for (const entry of entries) {
        categoryIdToArticleAmount.set(Number.parseInt(entry[0]), entry[1]);
      }
      setCategoryIdToArticleAmount(categoryIdToArticleAmount);
    }
  }, [articleAmountGroupedById]);

  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);
  const [modifyCategoryLoading, setModifyCategoryLoading] = useState(false);
  const modifyCategory = useCallback(
    (
      id: CategoryModelModifyParameters[0],
      modifiedParts: CategoryModelModifyParameters[1],
      onSuccess: () => void,
      onError: (e: unknown) => void,
    ) => {
      setModifyCategoryLoading(true);
      categoryModel
        .modify(id, modifiedParts)
        .then(() => {
          // Modify local record instead of request again.
          assert(idToCategory);
          const modifiedCategory = idToCategory.get(id);
          assert(modifiedCategory);
          Object.assign(modifiedCategory, modifiedParts);
          setIdToCategory(idToCategory);

          onSuccess();
        })
        .catch(onError)
        .finally(() => {
          setModifyCategoryLoading(false);
        });
    },
    [categoryModel, idToCategory],
  );

  const [deleteCategoryByIdLoading, setDeleteCategoryByIdLoading] =
    useState(false);
  const deleteCategoryById = useCallback(
    (id: Category['id'], onError: (e: unknown) => void) => {
      setDeleteCategoryByIdLoading(true);
      categoryModel
        .deleteById(id)
        .then(() => {
          assert(idToCategory);
          idToCategory.delete(id);
          setIdToCategory(idToCategory);
        })
        .catch(onError)
        .finally(() => {
          setDeleteCategoryByIdLoading(false);
        });
    },
    [categoryModel, idToCategory],
  );

  return {
    idToCategory,
    idToCategoryLoading: categoriesLoading,
    idToCategoryError: categoriesError,
    categoryIdToArticleAmountLoading: articleAmountGroupedByIdLoading,
    categoryIdToArticleAmountError: articleAmountGroupedByIdError,
    categoryIdToArticleAmount,
    modifyCategory,
    modifyCategoryLoading,
    deleteCategoryById,
    deleteCategoryByIdLoading,
  };
}
