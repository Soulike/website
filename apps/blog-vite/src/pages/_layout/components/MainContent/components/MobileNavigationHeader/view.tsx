import {Header} from 'antd/lib/layout/layout';

import avatar from '@/src/static/avatar.png';

// TODO: Check better ways to import CategoryMenu
import {CategoryMenu} from '../../../CategoryMenu';
import style from './style.module.css';

export function MobileNavigationHeader() {
  return (
    <Header className={style.NavigationHeader}>
      <div className={style.headerInner}>
        <div className={style.avatarWrapper}>
          <img src={avatar} className={style.avatar} alt={'avatar'} />
        </div>
        <div className={style.categoryMenuWrapper}>
          <CategoryMenu isMobile={true} />
        </div>
      </div>
    </Header>
  );
}
