import assert from 'node:assert';

import {useModal, useTextInput} from '@website/hooks';
import {BlogModels} from '@website/model';
import {BlogModelHooks} from '@website/model/react';
import {useCallback, useEffect, useMemo, useState} from 'react';

export function useViewModel() {
  const {
    value: aboutMarkdown,
    setValue: setAboutMarkdown,
    onChange: onAboutMarkdownInputChange,
  } = useTextInput();
  const {
    show: showAboutPreviewModal,
    hide: hideAboutPreviewModal,
    visible: aboutPreviewModalVisible,
  } = useModal();
  const {
    about,
    loading: aboutLoading,
    error: aboutLoadError,
  } = BlogModelHooks.OptionModelHooks.useAbout();
  useEffect(() => {
    if (!aboutLoading && !aboutLoadError && about) {
      setAboutMarkdown(about);
    }
  }, [about, aboutLoadError, aboutLoading, setAboutMarkdown]);

  const {
    submitting: aboutModificationSubmitting,
    handleAboutModificationSubmit,
  } = useSubmitAboutModification();

  return {
    aboutLoading,
    aboutLoadError,
    aboutMarkdown,
    onAboutMarkdownInputChange,
    showAboutPreviewModal,
    hideAboutPreviewModal,
    aboutPreviewModalVisible,
    aboutModificationSubmitting,
    handleAboutModificationSubmit,
  };
}

function useSubmitAboutModification() {
  const optionModel = useMemo(() => new BlogModels.OptionModel(), []);
  const [submitting, setSubmitting] = useState(false);
  const handleAboutModificationSubmit = useCallback(
    (
      about: string,
      onValidationFailed: (message: string) => void,
      onSuccess: (about: string) => void,
      onError: (e: Error) => void,
    ) => {
      const validationPassed = about.length > 0;
      if (!validationPassed) {
        onValidationFailed('Please input about content');
        return;
      }

      setSubmitting(true);
      optionModel
        .setAbout(about)
        .then(() => {
          onSuccess(about);
        })
        .catch((error: unknown) => {
          assert(error instanceof Error);
          onError(error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [optionModel],
  );

  return {
    submitting,
    handleAboutModificationSubmit,
  };
}
