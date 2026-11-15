import assert from 'node:assert';

import {useTextInput} from '@library/hooks';
import {BlogModels} from '@module/model/admin';
import {type Category, CategoryDraftSchema} from '@schema/blog';
import {useCallback, useMemo, useState} from 'react';

import {
  CATEGORY_DRAFT_FIELD_LABELS,
  getValidationErrorMessage,
} from '@/helpers/validation-i18n-helper.js';

export function useViewModel() {
  const {
    value: categoryName,
    onChange: onCategoryNameInputChange,
    resetValue: resetCategoryInput,
  } = useTextInput();
  const {submitting: newCategorySubmitting, handleNewCategorySubmit} =
    useNewCategorySubmit(() => {
      resetCategoryInput();
    });

  return {
    categoryName,
    onCategoryNameInputChange,
    newCategorySubmitting,
    handleNewCategorySubmit,
  };
}

function useNewCategorySubmit(afterSubmitSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);

  const handleNewCategorySubmit = useCallback(
    (
      name: Category['name'] | null,
      onValidationFailed: (message: string) => void,
      onSubmitSuccess: () => void,
      onSubmitFailed: (error: Error) => void,
    ) => {
      const parsedDraft = CategoryDraftSchema.safeParse({name});
      if (!parsedDraft.success) {
        getValidationErrorMessage(
          parsedDraft.error.issues[0],
          CATEGORY_DRAFT_FIELD_LABELS,
        )
          .then((message) => {
            onValidationFailed(message);
          })
          .catch((e: unknown) => {
            console.error(e);
          });
        return;
      }

      setSubmitting(true);
      categoryModel
        .add(parsedDraft.data)
        .then(() => {
          onSubmitSuccess();
          afterSubmitSuccess?.();
        })
        .catch((error: unknown) => {
          assert(error instanceof Error);
          onSubmitFailed(error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [afterSubmitSuccess, categoryModel],
  );

  return {
    submitting,
    handleNewCategorySubmit,
  };
}
