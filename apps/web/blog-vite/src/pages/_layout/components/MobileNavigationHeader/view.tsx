import {Header} from 'antd/lib/layout/layout';

import avatar from '../assets/avatar.png';
import {CategoryMenuMobile} from '../CategoryMenu/index.js';
import style from './style.module.css';

export function MobileNavigationHeader() {
  return (
    <Header className={style.NavigationHeader}>
      <div className={style.headerInner}>
        <div className={style.avatarWrapper}>
          <img src={avatar} className={style.avatar} alt={'avatar'} />
        </div>
        <div className={style.categoryMenuWrapper}>
          <CategoryMenuMobile />
        </div>
      </div>
    </Header>
  );
}
