'use client';

import {type ButtonProps, message, type ModalProps, notification} from 'antd';
import {type TextAreaProps} from 'antd/lib/input';
import React, {useEffect, useState} from 'react';

import {showNetworkError} from '@/apis/utils';
import {useAbout} from '@/hooks/useAbout';

import {AboutView} from './View';

export function About() {
  const [aboutMarkdown, setAboutMarkdown] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const {loading: loadingAbout, set: setAbout, get: getAbout} = useAbout();

  useEffect(() => {
    void getAbout()
      .then((response) => {
        if (response.isSuccessful) {
          const {
            data: {about: aboutMarkdown},
          } = response;
          setAboutMarkdown(aboutMarkdown);
        } else {
          notification.warning({message: response.message});
        }
      })
      .catch((e) => {
        showNetworkError(e);
      });
  }, [getAbout]);

  const onAboutTextareaChange: TextAreaProps['onChange'] = (e) => {
    setAboutMarkdown(e.target.value);
  };

  const onPreviewButtonClick: ButtonProps['onClick'] = () => {
    setPreviewModalOpen(true);
  };

  const onSubmitButtonClick: ButtonProps['onClick'] = () => {
    const executor = async () => {
      if (aboutMarkdown.length !== 0) {
        try {
          const response = await setAbout(aboutMarkdown);
          if (response.isSuccessful) {
            notification.success({message: '修改关于成功'});
          } else {
            notification.warning({message: response.message});
          }
        } catch (e) {
          showNetworkError(e);
        }
      } else {
        void message.warning('关于内容不能为空');
      }
    };

    void executor();
  };

  const onPreviewModalOk: ModalProps['onOk'] = () => {
    setPreviewModalOpen(false);
  };

  const onPreviewModalCancel: ModalProps['onCancel'] = onPreviewModalOk;

  return (
    <AboutView
      onSubmitButtonClick={onSubmitButtonClick}
      aboutMarkdown={aboutMarkdown}
      previewModalOpen={previewModalOpen}
      onAboutTextareaChange={onAboutTextareaChange}
      onPreviewButtonClick={onPreviewButtonClick}
      onPreviewModalCancel={onPreviewModalCancel}
      onPreviewModalOk={onPreviewModalOk}
      loading={loadingAbout}
    />
  );
}

export default React.memo(About);
