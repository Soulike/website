import {HTMLContainer} from './styled';

interface Props {
    HTMLContent: string;
}

export function MarkdownView(props: Props) {
    const {HTMLContent} = props;
    return <HTMLContainer dangerouslySetInnerHTML={{__html: HTMLContent}} />;
}
