import assert from 'node:assert';

import {useTextInput} from '@library/hooks';
import {BlogModels} from '@module/model/admin';
import {BlogModelHooks} from '@module/model/react/admin';
import {SiteOptionSchema} from '@schema/blog';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {useArticlePreviewModal} from '@/components/ArticlePreviewModal';
import {
  SITE_OPTION_FIELD_LABELS,
  validateFormSchema,
} from '@/helpers/validation-i18n-helper.js';

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
    if (
      !aboutLoading &&
      !aboutLoadError &&
      about !== null &&
      about.length > 0
    ) {
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
      const option = validateFormSchema(
        SiteOptionSchema,
        {about},
        SITE_OPTION_FIELD_LABELS,
        onValidationFailed,
      );
      if (option === null) {
        return;
      }

      setSubmitting(true);
      optionModel
        .setAbout(option.about)
        .then(() => {
          onSuccess(option.about);
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
