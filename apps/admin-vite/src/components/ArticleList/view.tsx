import assert from 'node:assert';

import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {type Article, type Category} from '@website/classes';
import {
  Button,
  type ButtonProps,
  List,
  Popconfirm,
  type PopconfirmProps,
  Skeleton,
  Space,
  Switch,
  type SwitchProps,
  Tag,
  Tooltip,
} from 'antd';
import {type DOMAttributes} from 'react';

import styles from './styles.module.css';

const {Item} = List;
const {Meta} = Item;

interface Props {
  idToArticle: Map<number, Article> | null;
  idToCategory: Map<number, Category> | null;
  isLoading: boolean;

  articleTitleClickHandlerFactory: (
    id: number,
  ) => DOMAttributes<HTMLSpanElement>['onClick'];
  processingArticleId: number | null;

  onIsVisibleSwitchClick: (id: number) => SwitchProps['onClick'];
  onModifyArticleButtonClick: (id: number) => ButtonProps['onClick'];
  deleteArticleButtonClickHandlerFactory: (
    id: number,
  ) => ButtonProps['onClick'];
  onDeleteArticleConfirm: PopconfirmProps['onConfirm'];
}

export function ArticleListView(props: Props) {
  const {
    idToArticle,
    idToCategory,
    isLoading,
    processingArticleId,
    articleTitleClickHandlerFactory,
    onIsVisibleSwitchClick,
    onModifyArticleButtonClick,
    deleteArticleButtonClickHandlerFactory,
    onDeleteArticleConfirm,
  } = props;

  return (
    <div className={styles.ArticleList}>
      <Skeleton loading={isLoading} active={true} paragraph={{rows: 15}}>
        <List
          dataSource={Array.from(idToArticle?.values() ?? [])}
          bordered={true}
          pagination={{
            position: 'bottom',
            pageSizeOptions: ['5', '10', '15', '20'],
            showSizeChanger: true,
            hideOnSinglePage: true,
          }}
          renderItem={(article) => {
            const {
              id,
              title,
              isVisible,
              category: categoryId,
              publicationTime: publicationTimeString,
              modificationTime: modificationTimeString,
            } = article;
            const publicationTime = new Date(publicationTimeString);
            const modificationTime = new Date(modificationTimeString);
            const category = idToCategory?.get(categoryId);
            assert(category);
            return (
              <Item key={id}>
                <Meta
                  title={
                    <span
                      className={styles.title}
                      onClick={articleTitleClickHandlerFactory(id)}
                    >
                      {title}
                    </span>
                  }
                />
                <Tag color={'blue'}>{category.name}</Tag>
                <Tag color={'geekblue'}>
                  Published at：
                  <time>
                    {`${publicationTime.getFullYear().toString()}-${(
                      publicationTime.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, '0')}-${publicationTime
                      .getDate()
                      .toString()
                      .padStart(2, '0')}`}
                  </time>
                </Tag>
                <Tag color={'geekblue'}>
                  Last Modified At：
                  <time>
                    {`${modificationTime.getFullYear().toString()}-${(
                      modificationTime.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, '0')}-${modificationTime
                      .getDate()
                      .toString()
                      .padStart(2, '0')}`}
                  </time>
                </Tag>
                <Tooltip title={'Change Visibility'}>
                  <Switch
                    className={styles.switch}
                    onClick={onIsVisibleSwitchClick(id)}
                    checked={isVisible}
                    disabled={processingArticleId === id}
                    loading={processingArticleId === id}
                    checkedChildren={'Public'}
                    unCheckedChildren={'Private'}
                  />
                </Tooltip>
                <Space.Compact size={'small'} className={styles.buttonWrapper}>
                  <Tooltip title={'Modify'}>
                    <Button
                      type={'primary'}
                      ghost={true}
                      onClick={onModifyArticleButtonClick(id)}
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title={'Delete'}>
                    <Popconfirm
                      title={`Confirm deleting《${title}》？`}
                      onConfirm={onDeleteArticleConfirm}
                    >
                      <Button
                        danger={true}
                        ghost={true}
                        onClick={deleteArticleButtonClickHandlerFactory(id)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                </Space.Compact>
              </Item>
            );
          }}
        />
      </Skeleton>
    </div>
  );
}
