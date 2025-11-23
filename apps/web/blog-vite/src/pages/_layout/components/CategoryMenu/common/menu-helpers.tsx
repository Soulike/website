import {
  HomeOutlined,
  InfoOutlined,
  TagOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import type {Category} from '@module/classes';
import {MenuProps} from 'antd';
import {Link} from 'react-router';

import {getCategoryLink} from '@/helpers/link-helpers.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

export interface MenuItemLabels {
  index: string;
  category: string;
  about: string;
}

export interface BuildMenuItemsOptions {
  categories: Category[];
  iconClassName: string;
  itemLabels: MenuItemLabels;
}

export function buildMenuItems({
  categories,
  iconClassName,
  itemLabels,
}: BuildMenuItemsOptions): MenuProps['items'] {
  return [
    {
      label: (
        <div>
          <Link to={PAGE_ID_TO_PATH[PAGE_ID.INDEX]}>
            <HomeOutlined className={iconClassName} />
            {itemLabels.index}
          </Link>
        </div>
      ),
      key: PAGE_ID_TO_PATH[PAGE_ID.INDEX],
    },
    {
      label: (
        <>
          <TagsOutlined className={iconClassName} />
          {itemLabels.category}
        </>
      ),
      key: 'categorySubmenu',
      children: categories.map((category) => {
        const {id, name} = category;
        return {
          label: (
            <div>
              <Link to={getCategoryLink(id)}>
                <TagOutlined className={iconClassName} />
                {name}
              </Link>
            </div>
          ),
          key: id,
        };
      }),
    },
    {
      label: (
        <div>
          <Link to={PAGE_ID_TO_PATH[PAGE_ID.ABOUT]}>
            <InfoOutlined className={iconClassName} />
            {itemLabels.about}
          </Link>
        </div>
      ),
      key: PAGE_ID_TO_PATH[PAGE_ID.ABOUT],
    },
  ];
}
