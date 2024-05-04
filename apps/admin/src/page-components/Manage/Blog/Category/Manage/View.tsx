import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {type Category} from '@website/classes';
import {Button, List, Popconfirm, Spin, Tag, Tooltip} from 'antd';
import {type ButtonProps} from 'antd';
import {type InputProps} from 'antd';
import {type ModalProps} from 'antd';
import {type PopconfirmProps} from 'antd';
import {type TagProps} from 'antd';

import {ArticleListModal} from './Component/ArticleListModal';
import {ModifyModal} from './Component/ModifyModal';
import Style from './Style.module.scss';

const {Item} = List;
const {Meta} = Item;
const {Group} = Button;

interface Props {
    loading: boolean;

    categoryMap: Map<number, Category>;
    categoryToArticleNumberMap: Map<number, number>;

    isArticleListModalVisible: boolean;
    categoryIdOfArticleListModal: number;
    onArticleAmountTagClick: (id: number) => TagProps['onClick'];
    onArticleListModalOk: ModalProps['onOk'];
    onArticleListModalCancel: ModalProps['onCancel'];

    onModifyButtonClick: (id: number) => ButtonProps['onClick'];
    isModifyModalVisible: boolean;
    onModifyModalOk: ModalProps['onOk'];
    onModifyModalCancel: ModalProps['onCancel'];
    nameOfCategoryToModify: string;
    onCategoryNameInputChange: InputProps['onChange'];

    onDeleteCategoryButtonClick: (id: number) => ButtonProps['onClick'];
    onDeleteCategoryConfirm: PopconfirmProps['onConfirm'];
}

export function ManageView(props: Props) {
    const {
        loading,
        categoryMap,
        categoryToArticleNumberMap,
        categoryIdOfArticleListModal,
        isArticleListModalVisible,
        onArticleAmountTagClick,
        onArticleListModalOk,
        onArticleListModalCancel,
        onDeleteCategoryButtonClick,
        onDeleteCategoryConfirm,
        isModifyModalVisible,
        onModifyModalOk,
        onModifyModalCancel,
        onModifyButtonClick,
        nameOfCategoryToModify,
        onCategoryNameInputChange,
    } = props;

    const categoryInModal = categoryMap.get(categoryIdOfArticleListModal);
    return (
        <div className={Style.Manage}>
            <List
                loading={loading}
                dataSource={Array.from(categoryMap.values())}
                bordered={true}
                pagination={{
                    position: 'bottom',
                    pageSizeOptions: ['5', '10', '15', '20'],
                    showSizeChanger: true,
                    hideOnSinglePage: true,
                }}
                renderItem={({id, name}) => {
                    return (
                        <Item>
                            <Meta title={<Tag color={'blue'}>{name}</Tag>} />
                            <Spin size={'small'} spinning={loading}>
                                <Tag
                                    onClick={onArticleAmountTagClick(id)}
                                    className={Style.articleAmountTag}
                                >
                                    文章：
                                    {categoryToArticleNumberMap.get(id)}
                                </Tag>
                            </Spin>
                            <Group
                                size={'small'}
                                className={Style.buttonWrapper}
                            >
                                <Tooltip title={'编辑文章分类'}>
                                    <Button
                                        type={'primary'}
                                        ghost={true}
                                        onClick={onModifyButtonClick(id)}
                                    >
                                        <EditOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'删除文章分类'}>
                                    <Popconfirm
                                        title={`确认删除文章分类 "${name}"？`}
                                        onConfirm={onDeleteCategoryConfirm}
                                    >
                                        <Button
                                            danger={true}
                                            ghost={true}
                                            onClick={onDeleteCategoryButtonClick(
                                                id,
                                            )}
                                        >
                                            <DeleteOutlined />
                                        </Button>
                                    </Popconfirm>
                                </Tooltip>
                            </Group>
                        </Item>
                    );
                }}
            ></List>
            <ArticleListModal
                open={isArticleListModalVisible}
                categoryInModal={categoryInModal}
                onOk={onArticleListModalOk}
                onCancel={onArticleListModalCancel}
            />
            <ModifyModal
                open={isModifyModalVisible}
                onOk={onModifyModalOk}
                onCancel={onModifyModalCancel}
                categoryName={nameOfCategoryToModify}
                onCategoryNameInputChange={onCategoryNameInputChange}
            />
        </div>
    );
}
