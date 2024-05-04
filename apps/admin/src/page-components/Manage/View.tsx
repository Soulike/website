import Image, {StaticImageData} from 'next/image';

import svg from '@/static/Manage/network_2.svg';

import Style from './Style.module.scss';

export function ManageIndex() {
    return (
        <div className={Style.ManageIndex}>
            <Image
                className={Style.image}
                src={svg as StaticImageData}
                alt='manage_index'
            />
        </div>
    );
}
