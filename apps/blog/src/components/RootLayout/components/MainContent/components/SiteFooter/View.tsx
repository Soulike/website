import {Footer} from 'antd/lib/layout/layout';
import type React from 'react';

import {Hitokoto} from './components/Hitokoto';
import Style from './Style.module.scss';

export interface ISiteFooterViewProps {
  fullYear: string;
}

export function SiteFooterView({fullYear}: ISiteFooterViewProps) {
  return (
    <Footer className={Style.SiteFooter}>
      <div className={Style.info}>
        {fullYear} - Designed & Created by Soulike
      </div>
      <div className={Style.hitokotoWrapper}>
        <Hitokoto />
      </div>
    </Footer>
  );
}
