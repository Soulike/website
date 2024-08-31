import Sider from 'antd/lib/layout/Sider';
import Image from 'next/image';
import type React from 'react';

import {CategoryMenu} from '@/src/components/RootLayout/components/CategoryMenu';
import avatar from '@/src/static/avatar.png';

import Style from './Style.module.scss';

export function NavigationSideBar() {
  return (
    <Sider className={Style.NavigationSideBar} theme={'light'}>
      <div className={Style.sidebarInner}>
        <div className={Style.avatarWrapper}>
          <Image
            src={avatar}
            className={Style.avatar}
            alt={'avatar'}
            priority={true}
          />
        </div>
        <div className={Style.categoryMenuWrapper}>
          <CategoryMenu isMobile={false} />
        </div>
      </div>
    </Sider>
  );
}
