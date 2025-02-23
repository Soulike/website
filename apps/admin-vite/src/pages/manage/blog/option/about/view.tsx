import {Button, type ButtonProps, Input, type ModalProps, Space} from 'antd';
import {type TextAreaProps} from 'antd/lib/input';

import {ArticlePreviewModal} from '@/components/ArticlePreviewModal';

import styles from './styles.module.css';

const {TextArea} = Input;

interface Props {
  aboutMarkdown: string;
  onAboutTextareaChange: TextAreaProps['onChange'];
  onPreviewButtonClick: ButtonProps['onClick'];
  onSubmitButtonClick: ButtonProps['onClick'];

  onPreviewModalOk: ModalProps['onOk'];
  onPreviewModalCancel: ModalProps['onCancel'];
  previewModalOpen: boolean;
  loading: boolean;
}

export function AboutView(props: Props) {
  const {
    onAboutTextareaChange,
    aboutMarkdown,
    onPreviewModalCancel,
    onPreviewModalOk,
    previewModalOpen,
    onSubmitButtonClick,
    onPreviewButtonClick,
    loading,
  } = props;

  return (
    <div className={styles.About}>
      <TextArea
        className={styles.textarea}
        placeholder={'Content（Markdown）'}
        onChange={onAboutTextareaChange}
        value={aboutMarkdown}
        disabled={loading}
      />
      <div className={styles.buttonWrapper}>
        <Space.Compact size={'large'}>
          <Button disabled={loading} onClick={onPreviewButtonClick}>
            Preview
          </Button>
          <Button
            disabled={loading}
            type={'primary'}
            onClick={onSubmitButtonClick}
          >
            Submit
          </Button>
        </Space.Compact>
      </div>
      <ArticlePreviewModal
        title={'About'}
        contentMarkdown={aboutMarkdown}
        onOk={onPreviewModalOk}
        onCancel={onPreviewModalCancel}
        open={previewModalOpen}
      />
    </div>
  );
}
