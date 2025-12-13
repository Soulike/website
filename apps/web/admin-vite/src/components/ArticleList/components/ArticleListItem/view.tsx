import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {DateString} from '@library/react-components';
import {Article, Category} from '@module/classes';
import {
  Button,
  ButtonProps,
  List,
  Popconfirm,
  PopconfirmProps,
  Space,
  Spin,
  Switch,
  SwitchProps,
  Tag,
  Tooltip,
} from 'antd';
import type {DOMAttributes} from 'react';

import styles from './styles.module.css';

const {Item} = List;
const {Meta} = Item;

export interface ArticleListItemViewProps {
  /**
   * @description Whether the item is allowed to edit.
   * */
  locked: boolean;
  loading: boolean;
  id: Article['id'];
  title: Article['title'];
  publicationTime: Date;
  modificationTime: Date;
  categoryName: Category['name'];

  onTitleClick: DOMAttributes<HTMLSpanElement>['onClick'];
  isVisibleSwitchChecked: boolean;
  onIsVisibleSwitchChange: SwitchProps['onChange'];
  onModifyButtonClick: ButtonProps['onClick'];
  onDeleteArticleConfirm: PopconfirmProps['onConfirm'];
}

export function ArticleListItemView(props: ArticleListItemViewProps) {
  const {
    id,
    title,
    publicationTime,
    modificationTime,
    categoryName,
    onTitleClick,
    isVisibleSwitchChecked,
    onIsVisibleSwitchChange,
    onModifyButtonClick,
    onDeleteArticleConfirm,
    locked,
    loading,
  } = props;

  return (
    <div className={styles.ArticleListItem}>
      <Spin spinning={loading} size={'small'}>
        <Item key={id}>
          <Meta
            title={
              <span className={styles.title} onClick={onTitleClick}>
                {title}
              </span>
            }
          />
          <div className={styles.tagContainer}>
            <Tag color={'blue'}>{categoryName}</Tag>
            <Tag color={'geekblue'}>
              Published at：
              <DateString date={publicationTime} />
            </Tag>
            <Tag color={'geekblue'}>
              Last Modified At：
              <DateString date={modificationTime} />
            </Tag>
          </div>
          <Tooltip title={'Change Visibility'}>
            <Switch
              className={styles.switch}
              onChange={onIsVisibleSwitchChange}
              checked={isVisibleSwitchChecked}
              disabled={locked}
              loading={loading}
              checkedChildren={'Public'}
              unCheckedChildren={'Private'}
            />
          </Tooltip>
          <Space.Compact size={'small'} className={styles.buttonWrapper}>
            <Tooltip title={'Modify'}>
              <Button
                type={'primary'}
                ghost={true}
                disabled={locked}
                onClick={onModifyButtonClick}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip title={'Delete'}>
              <Popconfirm
                title={`Confirm deleting《${title}》？`}
                onConfirm={onDeleteArticleConfirm}
              >
                <Button danger={true} ghost={true} disabled={locked}>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Tooltip>
          </Space.Compact>
        </Item>
      </Spin>
    </div>
  );
}
