import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {type Category} from '@website/classes';
import {
  Button,
  type ButtonProps,
  type InputProps,
  List,
  type ModalProps,
  Popconfirm,
  type PopconfirmProps,
  Space,
  Spin,
  Tag,
  type TagProps,
  Tooltip,
} from 'antd';

import {ArticleListModal} from './components/ArticleListModal';
import {ModifyModal} from './components/ModifyModal';
import Style from './styles.module.css';

const {Item} = List;
const {Meta} = Item;

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
              <Space.Compact size={'small'} className={Style.buttonWrapper}>
                <Tooltip title={'Modify category'}>
                  <Button
                    type={'primary'}
                    ghost={true}
                    onClick={onModifyButtonClick(id)}
                  >
                    <EditOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title={'Delete category'}>
                  <Popconfirm
                    title={`Confirm deleting "${name}"?`}
                    onConfirm={onDeleteCategoryConfirm}
                  >
                    <Button
                      danger={true}
                      ghost={true}
                      onClick={onDeleteCategoryButtonClick(id)}
                    >
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </Tooltip>
              </Space.Compact>
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
