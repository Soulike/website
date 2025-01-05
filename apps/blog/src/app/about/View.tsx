import {Markdown} from '@website/react-components/ssr';

import Style from './Style.module.scss';

interface Props {
  aboutMarkdown: string;
}

export function AboutView(props: Props) {
  const {aboutMarkdown} = props;
  return (
    <div className={Style.About}>
      <header className={Style.header}>
        <h1 className={Style.title}>关于</h1>
      </header>
      <Markdown>{aboutMarkdown}</Markdown>
    </div>
  );
}
