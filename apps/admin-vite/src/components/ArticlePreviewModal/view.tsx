import {Article} from '@website/classes';
import {Markdown} from '@website/react-components/csr';
import {Modal, type ModalProps, Skeleton} from 'antd';

import styles from './styles.module.css';
import {useViewModel} from './view-model.js';

export interface ArticlePreviewModalProps {
  title: Article['title'];
  contentMarkdown: Article['content'];
  shown: ModalProps['open'];
  onOkButtonClick: ModalProps['onOk'];
}

export function ArticlePreviewModal(props: ArticlePreviewModalProps) {
  const {title, shown, onOkButtonClick, contentMarkdown} = props;

  const {isMarkdownRendering, onMarkdownRenderFinish, onMarkdownRenderStart} =
    useViewModel();

  return (
    <Modal
      title={title}
      width={'80vw'}
      closable={false}
      open={shown}
      onOk={onOkButtonClick}
      destroyOnClose={true}
      cancelButtonProps={{style: {display: 'none'}}}
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
