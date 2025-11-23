import assert from 'node:assert';

import {useTextInput} from '@library/hooks';
import {BlogModels} from '@module/model/admin';
import {BlogModelHooks} from '@module/model/react/admin';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {useArticlePreviewModal} from '@/components/ArticlePreviewModal';

export function useViewModel() {
  const {
    value: aboutMarkdown,
    setValue: setAboutMarkdown,
    onChange: onAboutMarkdownInputChange,
  } = useTextInput();
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

  const {
    modal: aboutPreviewModal,
    show: showAboutPreviewModal,
    setTitle: setAboutPreviewModalTitle,
    setContentMarkdown: setAboutPreviewModalContentMarkdown,
    visible: aboutPreviewModalVisible,
  } = useArticlePreviewModal();

  useEffect(() => {
    if (aboutPreviewModalVisible) {
      setAboutPreviewModalTitle('About');
      setAboutPreviewModalContentMarkdown(aboutMarkdown);
    }
  }, [
    aboutMarkdown,
    aboutPreviewModalVisible,
    setAboutPreviewModalContentMarkdown,
    setAboutPreviewModalTitle,
  ]);

  return {
    aboutLoading,
    aboutLoadError,
    aboutMarkdown,
    onAboutMarkdownInputChange,
    aboutPreviewModal,
    showAboutPreviewModal,
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
