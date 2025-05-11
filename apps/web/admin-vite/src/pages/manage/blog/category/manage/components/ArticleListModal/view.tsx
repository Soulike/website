import {type Category} from '@website/classes';
import {Modal, type ModalProps} from 'antd';

import {ArticleList} from '@/components/ArticleList';

import styles from './styles.module.css';

interface Props {
  open: ModalProps['open'];
  categoryInModal?: Category;
  onOk: ModalProps['onOk'];
  onCancel: ModalProps['onCancel'];
}

export function ArticleListModal(props: Props) {
  const {open, categoryInModal, onOk, onCancel} = props;
  return (
    <Modal
      title={`Articles in ${categoryInModal ? categoryInModal.name : ''}`}
      open={open}
      width={'80vw'}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnHidden={true}
    >
      <div className={styles.ArticleListModal}>
        <ArticleList
          category={categoryInModal ? categoryInModal.id : undefined}
        />
      </div>
    </Modal>
  );
}
