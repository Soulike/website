import {Markdown} from '@website/react-components/csr';
import {Modal, type ModalProps} from 'antd';

import Style from './Style.module.scss';

interface Props {
  title: string;
  contentMarkdown: string;
  open: ModalProps['open'];
  onOk: ModalProps['onOk'];
  onCancel: ModalProps['onCancel'];
}

export function ArticlePreviewModal(props: Props) {
  const {title, contentMarkdown, open, onOk, onCancel} = props;
  return (
    <Modal
      title={title}
      width={'80vw'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <div className={Style.ArticlePreviewModal}>
        <Markdown>{contentMarkdown}</Markdown>
      </div>
    </Modal>
  );
}
