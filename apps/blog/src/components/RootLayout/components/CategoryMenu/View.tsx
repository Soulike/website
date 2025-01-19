'use client';

import {
  HomeOutlined,
  InfoOutlined,
  TagOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import type {Category} from '@website/classes';
import {Menu} from 'antd';
import Link from 'next/link';
import React, {useMemo} from 'react';

import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/src/config/route';
import {getCategoryLink} from '@/src/utils/route';

import Style from './Style.module.scss';

export interface ICategoryMenuViewProps {
  categories: Category[];
  isMobile: boolean;
}

export function CategoryMenuView({
  categories,
  isMobile,
}: ICategoryMenuViewProps) {
  const menuItems = useMemo(
    () => [
      {
        label: (
          <div className={Style.item}>
            <Link href={PAGE_ID_TO_ROUTE[PAGE_ID.INDEX]}>
              <HomeOutlined className={Style.icon} />
              首页
            </Link>
          </div>
        ),
        key: PAGE_ID_TO_ROUTE[PAGE_ID.INDEX],
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
                <Link href={getCategoryLink(id)}>
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
            <Link href={PAGE_ID_TO_ROUTE[PAGE_ID.ABOUT]}>
              <InfoOutlined className={Style.icon} />
              关于
            </Link>
          </div>
        ),
        key: PAGE_ID_TO_ROUTE[PAGE_ID.ABOUT],
      },
    ],
    [categories],
  );

  return isMobile ? (
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
  );
}
