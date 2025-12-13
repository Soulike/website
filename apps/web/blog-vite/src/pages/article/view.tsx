import {ClockCircleOutlined, TagOutlined} from '@ant-design/icons';
import {Markdown} from '@library/react-components/csr';
import {Article, type Category} from '@module/classes';
import {Alert, Skeleton, Tag} from 'antd';

import {getDateString} from '@/helpers/date-helpers.js';

import style from './style.module.css';

interface Props {
  article: Article;
  category: Category;
  shouldShowOutdatedWarningMessage: boolean;
  outdatedWarningMessage: string;
  loading: boolean;
}

export function ArticleView(props: Props) {
  const {
    shouldShowOutdatedWarningMessage,
    outdatedWarningMessage,
    article,
    category,
    loading,
  } = props;
  const publicationTime = new Date(article.publicationTime);
  return (
    <div className={style.Article}>
      <Skeleton active={true} loading={loading}>
        <header className={style.header}>
          <h1 className={style.title}>{article.title}</h1>
          <div className={style.info}>
            <Tag color={'purple'}>
              <ClockCircleOutlined className={style.icon} />
              <span>{getDateString(publicationTime)}</span>
            </Tag>
            <Tag color={'blue'}>
              <TagOutlined className={style.icon} />
              <span>{category.name}</span>
            </Tag>
          </div>
        </header>
        {shouldShowOutdatedWarningMessage && (
          <Alert
            className={style.alert}
            type={'warning'}
            banner={true}
            title={outdatedWarningMessage}
          />
        )}
        <Markdown>{article.content}</Markdown>
      </Skeleton>
    </div>
  );
}
