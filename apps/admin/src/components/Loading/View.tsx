import {LoadingOutlined} from '@ant-design/icons';
import Spin from 'antd/lib/spin';

import manager from '@/static/manager.svg';

import Style from './Style.module.scss';

export function Loading() {
    return (
        <div className={Style.Loading}>
            <img src={manager.src} className={Style.icon} alt={'icon'} />
            <Spin size={'large'} indicator={<LoadingOutlined />} />
        </div>
    );
}
