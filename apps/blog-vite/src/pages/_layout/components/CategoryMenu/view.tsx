import {
  HomeOutlined,
  InfoOutlined,
  TagOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import type {Category} from '@website/classes';
import {Menu, Spin} from 'antd';
import {useMemo} from 'react';
import {Link} from 'react-router';

import {getCategoryLink} from '@/helpers/get-category-link.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

import Style from './style.module.css';

export interface ICategoryMenuViewProps {
  loading: boolean;
  categories: Category[];
  isMobile: boolean;
}

export function CategoryMenuView({
  loading,
  categories,
  isMobile,
}: ICategoryMenuViewProps) {
  const menuItems = useMemo(
    () => [
      {
        label: (
          <div className={Style.item}>
            <Link to={PAGE_ID_TO_PATH[PAGE_ID.INDEX]}>
              <HomeOutlined className={Style.icon} />
              首页
            </Link>
          </div>
        ),
        key: PAGE_ID_TO_PATH[PAGE_ID.INDEX],
      },
      {
        label: (
          <>
            <TagsOutlined className={Style.icon} />
            分类
          </>
        ),
        key: 'categorySubmenu',
        children: categories.map((category) => {
          const {id, name} = category;
          return {
            label: (
              <div>
                <Link to={getCategoryLink(id)}>
                  <TagOutlined className={Style.icon} />
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
          <div className={Style.item}>
            <Link to={PAGE_ID_TO_PATH[PAGE_ID.ABOUT]}>
              <InfoOutlined className={Style.icon} />
              关于
            </Link>
          </div>
        ),
        key: PAGE_ID_TO_PATH[PAGE_ID.ABOUT],
      },
    ],
    [categories],
  );

  return (
    <Spin spinning={loading} size={'small'}>
      {isMobile ? (
        <Menu
          className={Style.CategoryMenuMobile}
          mode={'horizontal'}
          selectable={false}
          items={menuItems}
          theme={'dark'}
        />
      ) : (
        <Menu
          className={Style.CategoryMenu}
          mode={'inline'}
          selectable={false}
          items={menuItems}
        />
      )}
    </Spin>
  );
}
