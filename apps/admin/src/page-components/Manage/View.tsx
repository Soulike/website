import svg from '@/static/Manage/network_2.svg';

import Style from './Style.module.scss';

export function ManageIndex() {
    return (
        <div className={Style.ManageIndex}>
            <img className={Style.image} src={svg.src} alt='manage_index' />
        </div>
    );
}
