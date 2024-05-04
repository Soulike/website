import Image, {StaticImageData} from 'next/image';

import svg from '@/static/Blog/macbook.svg';

import Style from './Style.module.scss';

export function BlogIndex() {
    return (
        <div className={Style.BlogIndex}>
            <Image
                className={Style.image}
                src={svg as StaticImageData}
                alt='manage_index'
            />
        </div>
    );
}
