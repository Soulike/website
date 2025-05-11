import {Footer} from 'antd/lib/layout/layout';

import {Hitokoto} from './components/Hitokoto';
import style from './style.module.css';

export interface ISiteFooterViewProps {
  fullYear: string;
}

export function SiteFooterView({fullYear}: ISiteFooterViewProps) {
  return (
    <Footer className={style.SiteFooter}>
      <div className={style.info}>
        {fullYear} - Designed & Created by Soulike
      </div>
      <div className={style.hitokotoWrapper}>
        <Hitokoto />
      </div>
    </Footer>
  );
}
