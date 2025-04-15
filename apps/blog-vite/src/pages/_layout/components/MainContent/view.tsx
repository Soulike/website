import {Layout} from 'antd';
import {Content} from 'antd/lib/layout/layout';
import type React from 'react';

import {MobileNavigationHeader} from '../MobileNavigationHeader';
import {SiteFooter} from './components/SiteFooter';
import Style from './style.module.css';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({children}: MainContentProps) {
  return (
    <Layout className={Style.MainContent}>
      {/* Show header on mobile */}
      <div className={Style.navigationHeaderWrapper}>
        <MobileNavigationHeader />
      </div>
      <Content className={Style.content}>{children}</Content>
      <div className={Style.siteFooterWrapper}>
        <SiteFooter />
      </div>
    </Layout>
  );
}
