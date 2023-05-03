import svg from '@/static/Blog/macbook.svg';

import Style from './Style.module.scss';

export function BlogIndex() {
    return (
        <div className={Style.BlogIndex}>
            <img className={Style.image} src={svg} alt='manage_index' />
        </div>
    );
}
