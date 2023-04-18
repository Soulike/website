import {useHljs} from '@/src/hooks/useHljs';
import {useMaxJax} from '@/src/hooks/useMaxJax';

import {ArticleShowerView} from './View';

interface IProps {
    HTMLContent: string;
}

export function ArticleShower(props: IProps) {
    const {HTMLContent} = props;
    const {loading, highlightedHtml} = useHljs(HTMLContent);
    useMaxJax([HTMLContent]);

    return (
        <ArticleShowerView
            HTMLContent={highlightedHtml ?? ''}
            loading={loading}
        />
    );
}
