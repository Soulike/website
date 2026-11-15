import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {type Category} from '@schema/blog';
import {
  Button,
  type ButtonProps,
  Empty,
  type InputProps,
  Listy,
  type ModalProps,
  Pagination,
  type PaginationProps,
  Popconfirm,
  type PopconfirmProps,
  Space,
  Spin,
  Tag,
  type TagProps,
  theme,
  Tooltip,
} from 'antd';

import {ArticleListModal} from './components/ArticleListModal';
import {ModifyModal} from './components/ModifyModal';
import Style from './styles.module.css';

interface Props {
  loading: boolean;

  idToCategory: Map<Category['id'], Category> | null;
  categoryToArticleNumberMap: Map<Category['id'], number> | null;
  currentPage: number;
  pageSize: number;
  onPaginationChange: NonNullable<PaginationProps['onChange']>;

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
  onArticleDeletedInModal?: () => void;
}

export function ManageView(props: Props) {
  const {
    loading,
    idToCategory,
    categoryToArticleNumberMap,
    currentPage,
    pageSize,
    onPaginationChange,
    categoryIdOfArticleListModal,
    isArticleListModalVisible,
    onArticleAmountTagClick,
    onArticleListModalOk,
    onArticleListModalCancel,
    onDeleteCategoryButtonClick,
    onDeleteCategoryConfirm,
    onArticleDeletedInModal,
    isModifyModalVisible,
    onModifyModalOk,
    onModifyModalCancel,
    onModifyButtonClick,
    nameOfCategoryToModify,
    onCategoryNameInputChange,
  } = props;
  const {token} = theme.useToken();

  const categories = Array.from(idToCategory?.values() ?? []);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCategories = categories.slice(
    startIndex,
    startIndex + pageSize,
  );
  const borderedStyle = {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
    borderRadius: token.borderRadiusLG,
  };

  const categoryInModal = idToCategory?.get(categoryIdOfArticleListModal);
  return (
    <div className={Style.Manage}>
      <Spin spinning={loading}>
        {categories.length === 0 ? (
          <div className={Style.emptyContainer} style={borderedStyle}>
            <Empty />
          </div>
        ) : (
          <>
            <Listy<Category>
              items={paginatedCategories}
              rowKey={'id'}
              rowHoverable={false}
              classNames={{root: Style.listyRoot}}
              styles={{
                root: borderedStyle,
                item: {paddingInline: token.paddingLG},
              }}
              itemRender={({id, name}) => {
                return (
                  <div className={Style.categoryItem}>
                    <div className={Style.categoryMeta}>
                      <Tag color={'blue'}>{name}</Tag>
                    </div>
                    <div className={Style.categoryActions}>
                      <Spin size={'small'} spinning={loading}>
                        <Tag
                          onClick={onArticleAmountTagClick(id)}
                          className={Style.articleAmountTag}
                        >
                          文章：
                          {categoryToArticleNumberMap?.get(id) ?? 0}
                        </Tag>
                      </Spin>
                      <Space.Compact size={'small'}>
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
                    </div>
                  </div>
                );
              }}
            />
            <Pagination
              className={Style.pagination}
              align={'end'}
              current={currentPage}
              pageSize={pageSize}
              total={categories.length}
              pageSizeOptions={['5', '10', '15', '20']}
              showSizeChanger={true}
              hideOnSinglePage={true}
              onChange={onPaginationChange}
            />
          </>
        )}
      </Spin>
      <ArticleListModal
        open={isArticleListModalVisible}
        categoryInModal={categoryInModal}
        onOk={onArticleListModalOk}
        onCancel={onArticleListModalCancel}
        onArticleDeleted={onArticleDeletedInModal}
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
