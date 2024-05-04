import Image, {type StaticImageData} from 'next/image';

import notFoundImage from '@/src/static/404_page_not_found_1.svg';

import Style from './Style.module.scss';

export function NotFound() {
    return (
        <div className={Style.NotFound}>
            <Image
                src={notFoundImage as StaticImageData}
                alt='not-found'
                className={Style.image}
            />
        </div>
    );
}
