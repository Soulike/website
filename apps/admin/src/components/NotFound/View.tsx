import Image, {StaticImageData} from 'next/image';

import notFoundImage from '@/static/404_page_not_found_1.svg';

import Style from './Style.module.scss';

export function NotFound() {
    return (
        <Image
            src={notFoundImage as StaticImageData}
            alt='not-found'
            className={Style.image}
        />
    );
}
