import {ClockCircleOutlined, TagOutlined} from '@ant-design/icons';
import {type Category} from '@website/classes';
import {Markdown} from '@website/react-components/ssr';
import {Alert, Tag} from 'antd';

import Style from './Style.module.scss';

interface Props {
  title: string;
  contentMarkdown: string;
  publicationTime: string;
  modificationTime: string;
  category: Category;
}

export function ArticleView(props: Props) {
  const {
    title,
    contentMarkdown,
    publicationTime: publicationTimeString,
    modificationTime: modificationTimeString,
    category,
  } = props;
  const publicationTime = new Date(publicationTimeString);
  const modificationTime = new Date(modificationTimeString);
  const nowTime = new Date();
  const timeDiff = nowTime.getTime() - modificationTime.getTime();
  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000; // 一个月，单位毫秒
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return (
    <div className={Style.Article}>
      <header className={Style.header}>
        <h1 className={Style.title}>{title}</h1>
        <div className={Style.info}>
          <Tag color={'purple'}>
            <ClockCircleOutlined className={Style.icon} />
            <span>
              {`${publicationTime.getFullYear().toString()}-${(
                publicationTime.getMonth() + 1
              )
                .toString()
                .padStart(2, '0')}-${publicationTime
                .getDate()
                .toString()
                .padStart(2, '0')}`}
            </span>
          </Tag>
          <Tag color={'blue'}>
            <TagOutlined className={Style.icon} />
            <span>{category.name}</span>
          </Tag>
        </div>
      </header>
      {timeDiff > ONE_MONTH ? (
        <Alert
          className={Style.alert}
          type={'warning'}
          banner={true}
          message={`本文最后编辑于 ${Math.floor(
            timeDiff / ONE_DAY,
          ).toString()} 天前，可能已不具有时效性，请谨慎阅读`}
        />
      ) : null}
      <Markdown>{contentMarkdown}</Markdown>
    </div>
  );
}
