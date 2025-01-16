import {Markdown} from '@website/react-components/csr';
import {Modal, type ModalProps, Skeleton} from 'antd';

import styles from './styles.module.css';

export interface ArticlePreviewModalViewProps {
  title: string;
  open: ModalProps['open'];
  onOk: ModalProps['onOk'];
  onCancel: ModalProps['onCancel'];
  loading: boolean;
  onMarkdownRenderFinish: () => unknown;
  onMarkdownRenderStart: () => unknown;
  contentMarkdown: string;
}

export function ArticlePreviewModalView(props: ArticlePreviewModalViewProps) {
  const {
    title,
    loading,
    open,
    onOk,
    onCancel,
    contentMarkdown,
    onMarkdownRenderStart,
    onMarkdownRenderFinish,
  } = props;
  return (
    <Modal
      title={title}
      width={'80vw'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <div className={styles.ArticlePreviewModal}>
        {loading && (
          <Skeleton
            loading={true}
            active={true}
            paragraph={true}
            title={true}
          />
        )}
        <div className={loading ? styles.hide : ''}>
          <Markdown
            onRenderStart={onMarkdownRenderStart}
            onRenderFinish={onMarkdownRenderFinish}
          >
            {contentMarkdown}
          </Markdown>
        </div>
      </div>
    </Modal>
  );
}
