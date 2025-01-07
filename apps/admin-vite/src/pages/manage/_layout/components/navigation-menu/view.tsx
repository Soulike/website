import {Link} from 'react-router';

import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';

import styles from './styles.module.css';

export function NavigationMenu() {
  return (
    <div className={styles.navigationMenu}>
      <div className={styles.navigationLinkContainer}>
        <Link to={PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.INDEX]}>Blog</Link>
      </div>
    </div>
  );
}
