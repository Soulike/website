export interface IMarkdownViewProps {
  HTMLContent: string;
}

export function MarkdownView(props: IMarkdownViewProps) {
  const {HTMLContent} = props;

  return (
    <article
      className={'Markdown'}
      dangerouslySetInnerHTML={{__html: HTMLContent}}
    />
  );
}
