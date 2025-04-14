import {Layout} from 'antd';
import {Content} from 'antd/lib/layout/layout';
import type {ReactNode} from 'react';

import {MobileNavigationHeader} from './components/MobileNavigationHeader';
import {SiteFooter} from './components/SiteFooter';
import Style from './style.module.css';

export interface IMainContentViewProps {
  fullYear: string;
  children: ReactNode;
}

export function MainContentView({children}: IMainContentViewProps) {
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
