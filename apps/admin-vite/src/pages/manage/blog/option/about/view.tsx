import {Button, type ButtonProps, Input, Space} from 'antd';
import {type TextAreaProps} from 'antd/lib/input';

import styles from './styles.module.css';

const {TextArea} = Input;

interface Props {
  aboutMarkdown: string;
  onAboutTextareaChange: TextAreaProps['onChange'];
  onPreviewButtonClick: ButtonProps['onClick'];
  onSubmitButtonClick: ButtonProps['onClick'];
  loading: boolean;
}

export function AboutView(props: Props) {
  const {
    onAboutTextareaChange,
    aboutMarkdown,
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
    </div>
  );
}
