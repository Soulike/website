import {type ButtonProps, notification} from 'antd';
import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {AboutView} from './view.js';
import {useViewModel} from './view-model.js';

export function About() {
  const {
    aboutLoading,
    aboutLoadError,
    aboutMarkdown,
    onAboutMarkdownInputChange,
    showAboutPreviewModal,
    aboutModificationSubmitting,
    handleAboutModificationSubmit,
    aboutPreviewModal,
  } = useViewModel();

  useEffect(() => {
    if (aboutLoadError) {
      showErrorNotification(aboutLoadError);
    }
  }, [aboutLoadError]);

  const onSubmitButtonClick: ButtonProps['onClick'] = () => {
    handleAboutModificationSubmit(
      aboutMarkdown,
      (message) => {
        notification.error({message});
      },
      () => {
        notification.success({message: 'About modified successfully'});
      },
      (error) => {
        showErrorNotification(error);
      },
    );
  };

  return (
    <>
      <AboutView
        onSubmitButtonClick={onSubmitButtonClick}
        aboutMarkdown={aboutMarkdown}
        onAboutTextareaChange={onAboutMarkdownInputChange}
        onPreviewButtonClick={showAboutPreviewModal}
        loading={aboutLoading || aboutModificationSubmitting}
      />
      {aboutPreviewModal}
    </>
  );
}
