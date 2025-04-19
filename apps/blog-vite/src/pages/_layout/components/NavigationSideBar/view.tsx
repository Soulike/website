import Sider from 'antd/lib/layout/Sider';

import avatar from '../assets/avatar.png';
import {CategoryMenu} from '../CategoryMenu';
import style from './style.module.css';

export function NavigationSideBar() {
  return (
    <Sider className={style.NavigationSideBar}>
      <div className={style.sidebarInner}>
        <div className={style.avatarWrapper}>
          <img src={avatar} className={style.avatar} alt={'avatar'} />
        </div>
        <div className={style.categoryMenuWrapper}>
          <CategoryMenu />
        </div>
      </div>
    </Sider>
  );
}
