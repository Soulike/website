'use client';

import {
  ClockCircleOutlined,
  EyeOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import {type Category} from '@website/classes';
import {Markdown} from '@website/react-components/csr';
import {Card, Tag} from 'antd';

import {ArticleLink} from './Component/ArticleLink';
import Style from './Style.module.scss';

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
      className={Style.ArticlePreviewCard}
      title={
        <div className={Style.header}>
          <ArticleLink articleId={articleId}>
            <header className={Style.title} title={articleTitle}>
              {articleTitle}
            </header>
          </ArticleLink>
          <div className={Style.info}>
            <Tag color={'purple'}>
              <ClockCircleOutlined className={Style.icon} />
              <span>
                {`${articleTime.getFullYear()}-${(articleTime.getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}-${articleTime
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`}
              </span>
            </Tag>
            <Tag color={'blue'}>
              <TagsOutlined className={Style.icon} />
              <span>{articleCategory ? articleCategory.name : ''}</span>
            </Tag>
            <Tag color={'geekblue'}>
              <EyeOutlined className={Style.icon} />
              <span>{articleViewAmount}</span>
            </Tag>
          </div>
        </div>
      }
      bordered={false}
    >
      <div className={Style.briefContainer}>
        <div className={Style.brief}>
          <Markdown>{articleBriefTextMarkdown}</Markdown>
        </div>
      </div>
      <ArticleLink articleId={articleId}>
        <>继续阅读 {'>'}</>
      </ArticleLink>
    </Card>
  );
}
