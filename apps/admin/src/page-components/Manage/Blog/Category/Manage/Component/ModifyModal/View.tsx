import {Input, Modal} from 'antd';
import {type InputProps} from 'antd';
import {type ModalProps} from 'antd';

import Style from './Style.module.scss';

interface Props {
    open: ModalProps['open'];
    onOk: ModalProps['onOk'];
    onCancel: ModalProps['onCancel'];

    categoryName: string;
    onCategoryNameInputChange: InputProps['onChange'];
}

export function ModifyModal(props: Props) {
    const {open, onCancel, onOk, onCategoryNameInputChange, categoryName} =
        props;
    return (
        <Modal
            title={'编辑文章分类'}
            destroyOnClose={true}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            width={'25vw'}
        >
            <div className={Style.ModifyModal}>
                <Input
                    className={Style.categoryNameInput}
                    addonBefore={'文章分类名'}
                    onChange={onCategoryNameInputChange}
                    value={categoryName}
                />
            </div>
        </Modal>
    );
}
