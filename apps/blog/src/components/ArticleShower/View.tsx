import {Skeleton} from 'antd';

import Style from './Style.module.scss';

interface Props {
    HTMLContent: string;
    loading?: boolean;
}

export function ArticleShowerView(props: Props) {
    const {HTMLContent, loading} = props;
    return (
        <Skeleton loading={loading} paragraph={{rows: 15}}>
            <article
                className={Style.ArticleShower}
                dangerouslySetInnerHTML={{__html: HTMLContent}}
            />
        </Skeleton>
    );
}
