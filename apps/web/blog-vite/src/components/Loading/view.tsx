import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';

import bookLover from './assets/book_lover.svg';
import styles from './styles.module.css';

export function Loading() {
  return (
    <div className={styles.loading}>
      <img src={bookLover} className={styles.icon} alt={'loading image'} />
      <Spin size={'large'} indicator={<LoadingOutlined />} />
    </div>
  );
}
