import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {type Article, type Category} from '@website/classes';
import {
  Button,
  type ButtonProps,
  List,
  type ModalProps,
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

import {ArticlePreviewModal} from '@/components/ArticlePreviewModal';

import styles from './styles.module.css';

const {Item} = List;
const {Meta} = Item;

interface Props {
  articleMap: Map<number, Article>;
  categoryMap: Map<number, Category>;
  isLoading: boolean;

  onArticleTitleClick: (
    id: number,
  ) => DOMAttributes<HTMLSpanElement>['onClick'];
  articleInModalTitle: string;
  articleInModalMarkdown: string;
  modalIsOpen: boolean;
  modalOnOk: ModalProps['onOk'];
  modalOnCancel: ModalProps['onCancel'];
  loadingArticleId: number;

  onIsVisibleSwitchClick: (id: number) => SwitchProps['onClick'];
  onModifyArticleButtonClick: (id: number) => ButtonProps['onClick'];
  onDeleteArticleButtonClick: (id: number) => ButtonProps['onClick'];
  onDeleteArticleConfirm: PopconfirmProps['onConfirm'];
}

export function ArticleListView(props: Props) {
  const {
    articleMap,
    categoryMap,
    isLoading,
    loadingArticleId,
    articleInModalMarkdown,
    articleInModalTitle,
    modalIsOpen,
    modalOnCancel,
    modalOnOk,
    onArticleTitleClick,
    onIsVisibleSwitchClick,
    onModifyArticleButtonClick,
    onDeleteArticleButtonClick,
    onDeleteArticleConfirm,
  } = props;
  return (
    <div className={styles.ArticleList}>
      <Skeleton loading={isLoading} active={true} paragraph={{rows: 15}}>
        <List
          dataSource={Array.from(articleMap.values())}
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
              publicationTime: publicationTimeString,
              modificationTime: modificationTimeString,
            } = article;
            const publicationTime = new Date(publicationTimeString);
            const modificationTime = new Date(modificationTimeString);
            return (
              <Item key={id}>
                <Meta
                  title={
                    <span
                      className={styles.title}
                      onClick={onArticleTitleClick(id)}
                    >
                      {title}
                    </span>
                  }
                />
                <Tag color={'blue'}>
                  {categoryMap.get(articleMap.get(id)?.category ?? 0)?.name ??
                    '??'}
                </Tag>
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
                    disabled={loadingArticleId === id}
                    loading={loadingArticleId === id}
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
                        onClick={onDeleteArticleButtonClick(id)}
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
      <ArticlePreviewModal
        title={articleInModalTitle}
        contentMarkdown={articleInModalMarkdown}
        open={modalIsOpen}
        onOk={modalOnOk}
        onCancel={modalOnCancel}
      />
    </div>
  );
}
