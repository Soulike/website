import {Header} from 'antd/lib/layout/layout';
import Image from 'next/image';
import type React from 'react';

import {CategoryMenu} from '@/src/components/RootLayout/components/CategoryMenu';
import avatar from '@/src/static/avatar.png';

import Style from './Style.module.scss';

export function NavigationHeader() {
  return (
    <Header className={Style.NavigationHeader}>
      <div className={Style.headerInner}>
        <div className={Style.avatarWrapper}>
          <Image
            src={avatar}
            className={Style.avatar}
            alt={'avatar'}
            priority={true}
          />
        </div>
        <div className={Style.categoryMenuWrapper}>
          <CategoryMenu isMobile={true} />
        </div>
      </div>
    </Header>
  );
}
