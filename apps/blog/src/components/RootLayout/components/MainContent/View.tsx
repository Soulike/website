import {Layout} from 'antd';
import {Content} from 'antd/lib/layout/layout';
import type React from 'react';

import {SiteFooter} from '@/src/components/RootLayout/components/MainContent/components/SiteFooter';

import {NavigationHeader} from './components/NavigationHeader';
import Style from './Style.module.scss';

export interface IMainContentViewProps {
  fullYear: string;
  children?: React.ReactNode;
}

export function MainContentView({children}: IMainContentViewProps) {
  return (
    <Layout className={Style.MainContent}>
      {/* Show header on mobile */}
      <div className={Style.navigationHeaderWrapper}>
        <NavigationHeader />
      </div>
      <Content className={Style.content}>{children}</Content>
      <div className={Style.siteFooterWrapper}>
        <SiteFooter />
      </div>
    </Layout>
  );
}
