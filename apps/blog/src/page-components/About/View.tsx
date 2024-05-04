import {Markdown} from '@website/react-components';
import {Skeleton} from 'antd';

import Style from './Style.module.scss';

interface Props {
  loading: boolean;
  aboutMarkdown: string;
}

export function AboutView(props: Props) {
  const {loading, aboutMarkdown} = props;
  return (
    <div className={Style.About}>
      <Skeleton
        loading={loading}
        active={true}
        title={true}
        paragraph={{
          rows: 20,
        }}
      >
        <header className={Style.header}>
          <h1 className={Style.title}>关于</h1>
        </header>
        <Markdown>{aboutMarkdown}</Markdown>
      </Skeleton>
    </div>
  );
}
