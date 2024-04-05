import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import Image from 'next/image';

import svg from '@/src/static/book_lover.svg';

import Style from './Style.module.scss';

export function Loading() {
    return (
        <div className={Style.Loading}>
            <Image
                src={svg}
                className={Style.icon}
                alt={'icon'}
                width={300}
                priority={true}
            />
            <Spin size={'large'} indicator={<LoadingOutlined />} />
        </div>
    );
}
