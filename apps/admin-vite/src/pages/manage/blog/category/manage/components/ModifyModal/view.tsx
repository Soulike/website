import {Input, type InputProps, Modal, type ModalProps} from 'antd';

import styles from './styles.module.css';

interface Props {
  open: ModalProps['open'];
  onOk: ModalProps['onOk'];
  onCancel: ModalProps['onCancel'];

  categoryName: string;
  onCategoryNameInputChange: InputProps['onChange'];
}

export function ModifyModal(props: Props) {
  const {open, onCancel, onOk, onCategoryNameInputChange, categoryName} = props;
  return (
    <Modal
      title={'Modify Category'}
      destroyOnClose={true}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={'25vw'}
    >
      <div className={styles.ModifyModal}>
        <Input
          className={styles.categoryNameInput}
          addonBefore={'Category'}
          onChange={onCategoryNameInputChange}
          value={categoryName}
        />
      </div>
    </Modal>
  );
}
