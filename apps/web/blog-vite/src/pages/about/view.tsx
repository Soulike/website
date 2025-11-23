import {Markdown, MarkdownProps} from '@library/react-components/csr';
import {Skeleton} from 'antd';

import style from './style.module.css';

interface Props {
  loading: boolean;
  aboutMarkdown: string;
  onRenderStart: MarkdownProps['onRenderStart'];
  onRenderFinish: MarkdownProps['onRenderFinish'];
}

export function AboutView(props: Props) {
  const {loading, aboutMarkdown, onRenderStart, onRenderFinish} = props;
  return (
    <div className={style.About}>
      <header className={style.header}>
        <h1 className={style.title}>关于</h1>
      </header>
      <Skeleton active={true} loading={loading} />
      <Markdown onRenderFinish={onRenderFinish} onRenderStart={onRenderStart}>
        {aboutMarkdown}
      </Markdown>
    </div>
  );
}
