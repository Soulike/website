import {ArticleList} from '@/components/ArticleList';

import Style from './Style.module.scss';

export function Manage() {
  return (
    <div className={Style.Manage}>
      <ArticleList />
    </div>
  );
}
