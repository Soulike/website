import Link from 'next/link';

import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/config/route';

import Style from './Style.module.scss';

export function LinkList() {
    return (
        <div className={Style.LinkList}>
            <div className={Style.linkItem}>
                <Link href={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.INDEX]}>
                    博客
                </Link>
            </div>
        </div>
    );
}
