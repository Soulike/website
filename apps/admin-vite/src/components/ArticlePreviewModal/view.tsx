import {Modal, type ModalProps} from 'antd';
import {ReactNode} from 'react';

import styles from './styles.module.css';

export interface ArticlePreviewModalViewProps {
  title: string;
  open: ModalProps['open'];
  onOk: ModalProps['onOk'];
  onCancel: ModalProps['onCancel'];
  loading: boolean;
  children: ReactNode;
}

export function ArticlePreviewModalView(props: ArticlePreviewModalViewProps) {
  const {title, children, open, onOk, onCancel, loading} = props;
  return (
    <Modal
      title={title}
      width={'80vw'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose={true}
      loading={loading}
    >
      <div className={styles.ArticlePreviewModal}>{children}</div>
    </Modal>
  );
}
