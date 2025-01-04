import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';

import manager from './assets/manager.svg';
import styles from './styles.module.css';

export function Loading() {
  return (
    <div className={styles.loading}>
      <img src={manager} className={styles.icon} alt={'loading image'} />
      <Spin size={'large'} indicator={<LoadingOutlined />} />
    </div>
  );
}
