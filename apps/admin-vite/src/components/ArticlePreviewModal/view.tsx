import {Markdown} from '@website/react-components/csr';
import {Modal, type ModalProps, Skeleton} from 'antd';

import styles from './styles.module.css';
import {useViewModel} from './view-model.js';

export interface ArticlePreviewModalProps {
  title: string;
  contentMarkdown: string;
  visible: ModalProps['open'];
  onOk: ModalProps['onOk'];
  onCancel: ModalProps['onCancel'];
}

export function ArticlePreviewModal(props: ArticlePreviewModalProps) {
  const {title, visible, onOk, onCancel, contentMarkdown} = props;

  const {isMarkdownRendering, onMarkdownRenderFinish, onMarkdownRenderStart} =
    useViewModel();

  return (
    <Modal
      title={title}
      width={'80vw'}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <div className={styles.ArticlePreviewModal}>
        {isMarkdownRendering && (
          <Skeleton
            loading={true}
            active={true}
            paragraph={true}
            title={true}
          />
        )}
        <div className={isMarkdownRendering ? styles.hide : ''}>
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
