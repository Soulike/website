import {Layout} from 'antd';
import type React from 'react';

import {MainContent} from './components/MainContent';
import {NavigationSideBar} from './components/NavigationSideBar';
import Style from './style.module.css';

export interface IRootLayoutViewProps {
  children?: React.ReactNode;
}

export function RootLayoutView({children}: IRootLayoutViewProps) {
  return (
    <Layout className={Style.RootLayout} hasSider={true}>
      {/* Show SideBar on desktop */}
      <div className={Style.navigationSideBarWrapper}>
        <NavigationSideBar />
      </div>
      <div className={Style.mainContentWrapper}>
        <MainContent>{children}</MainContent>
      </div>
    </Layout>
  );
}
