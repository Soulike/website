import {Skeleton} from 'antd';

import {ArticleShower} from '@/src/components/ArticleShower';

import Style from './Style.module.scss';

interface Props {
    loading: boolean;
    aboutHtml: string;
}

export function AboutView(props: Props) {
    const {loading, aboutHtml} = props;
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
                <ArticleShower HTMLContent={aboutHtml} />
            </Skeleton>
        </div>
    );
}
