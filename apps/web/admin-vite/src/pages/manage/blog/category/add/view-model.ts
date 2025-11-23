import assert from 'node:assert';

import {useTextInput} from '@library/hooks';
import {Category, NewCategory} from '@module/classes';
import {BlogModels} from '@module/model/admin';
import {useCallback, useMemo, useState} from 'react';

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
      const validationPass = NewCategory.validateFormInput(
        {name},
        onValidationFailed,
      );
      if (!validationPass) {
        return;
      }

      assert(name !== null);
      setSubmitting(true);
      categoryModel
        .add({name})
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
