import {type ButtonProps, message, type ModalProps, notification} from 'antd';
import {type TextAreaProps} from 'antd/lib/input';
import React, {useEffect, useState} from 'react';

import {Blog} from '@/apis';

import {AboutView} from './View';

export function About() {
  const [aboutMarkdown, setAboutMarkdown] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    void Blog.Option.get().then((result) => {
      if (result !== null) {
        const {about: aboutMarkdown} = result;
        setAboutMarkdown(aboutMarkdown);
        setLoading(false);
      }
    });
  }, []);

  const onAboutTextareaChange: TextAreaProps['onChange'] = (e) => {
    setAboutMarkdown(e.target.value);
  };

  const onPreviewButtonClick: ButtonProps['onClick'] = () => {
    setPreviewModalOpen(true);
  };

  const onSubmitButtonClick: ButtonProps['onClick'] = () => {
    const executor = async () => {
      if (aboutMarkdown.length !== 0) {
        setLoading(true);
        const result = await Blog.Option.set(aboutMarkdown);
        setLoading(false);
        if (result !== null) {
          notification.success({message: '修改关于成功'});
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
      loading={loading}
    />
  );
}

export default React.memo(About);
