import {
  ClockCircleOutlined,
  EyeOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import {Markdown} from '@library/react-components/csr';
import {type Category} from '@module/classes';
import {Card, Tag} from 'antd';

import {getDateString} from '@/helpers/date-helpers.js';

import {ArticleLink} from './components/ArticleLink/index.js';
import styles from './styles.module.css';

interface IProps {
  loading: boolean;
  articleId: number;
  articleTitle: string;
  articleTime: Readonly<Date>;
  articleCategory: Readonly<Category> | undefined;
  articleViewAmount: number;
  articleBriefTextMarkdown: string;
}

export function ArticlePreviewCard(props: IProps) {
  const {
    loading,
    articleId,
    articleTitle,
    articleTime,
    articleCategory,
    articleViewAmount,
    articleBriefTextMarkdown,
  } = props;
  return (
    <Card
      loading={loading}
      className={styles.ArticlePreviewCard}
      title={
        <div className={styles.header}>
          <ArticleLink articleId={articleId}>
            <header className={styles.title} title={articleTitle}>
              {articleTitle}
            </header>
          </ArticleLink>
          <div className={styles.info}>
            <Tag color={'purple'}>
              <ClockCircleOutlined className={styles.icon} />
              <span>{getDateString(articleTime)}</span>
            </Tag>
            <Tag color={'blue'}>
              <TagsOutlined className={styles.icon} />
              <span>{articleCategory ? articleCategory.name : ''}</span>
            </Tag>
            <Tag color={'geekblue'}>
              <EyeOutlined className={styles.icon} />
              <span>{articleViewAmount}</span>
            </Tag>
          </div>
        </div>
      }
      variant={'borderless'}
    >
      <div className={styles.briefContainer}>
        <div className={styles.brief}>
          <Markdown>{articleBriefTextMarkdown}</Markdown>
        </div>
      </div>
      <ArticleLink articleId={articleId}>
        <>继续阅读 {'>'}</>
      </ArticleLink>
    </Card>
  );
}
