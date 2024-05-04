import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import Image, {StaticImageData} from 'next/image';

import manager from '@/static/manager.svg';

import Style from './Style.module.scss';

export function Loading() {
    return (
        <div className={Style.Loading}>
            <Image
                src={manager as StaticImageData}
                className={Style.icon}
                alt={'loading icon'}
            />
            <Spin size={'large'} indicator={<LoadingOutlined />} />
        </div>
    );
}
