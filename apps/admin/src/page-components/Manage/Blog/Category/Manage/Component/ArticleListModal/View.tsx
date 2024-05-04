import {type Category} from '@website/classes';
import {Modal} from 'antd';
import {type ModalProps} from 'antd';
import React from 'react';

import {ArticleList} from '@/components/ArticleList';

import Style from './Style.module.scss';

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
            title={`分类"${
                categoryInModal ? categoryInModal.name : ''
            }"下的文章`}
            open={open}
            width={'80vw'}
            onOk={onOk}
            onCancel={onCancel}
            destroyOnClose={true}
        >
            <div className={Style.ArticleListModal}>
                <ArticleList
                    categoryIdFilter={
                        categoryInModal ? categoryInModal.id : undefined
                    }
                />
            </div>
        </Modal>
    );
}
