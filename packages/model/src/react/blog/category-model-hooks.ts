import {Category, CategoryIdToArticleAmount} from '@website/classes';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';

import {CategoryModel} from '../../models/blog/category-model.js';

export class CategoryModelHooks {
  private static readonly categoryModel = new CategoryModel();

  public static useAllCategories(
    onSuccess?: ResolveCallback<Category[]>,
    onReject?: RejectCallback,
  ) {
    const {pending, resolvedValue, rejectedError} = usePromise(
      this.categoryModel.getAll(),
      onSuccess,
      onReject,
    );

    return {
      loading: pending,
      error: rejectedError,
      categories: resolvedValue,
    };
  }

  public static useArticleAmountGroupedById(
    onSuccess?: ResolveCallback<CategoryIdToArticleAmount>,
    onReject?: RejectCallback,
  ) {
    const {pending, resolvedValue, rejectedError} = usePromise(
      this.categoryModel.getArticleAmountGroupedById(),
      onSuccess,
      onReject,
    );

    return {
      loading: pending,
      error: rejectedError,
      articleAmountGroupedById: resolvedValue,
    };
  }
}
