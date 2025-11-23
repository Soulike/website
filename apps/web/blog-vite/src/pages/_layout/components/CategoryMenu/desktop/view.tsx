import type {Category} from '@module/classes';
import {Menu, Spin} from 'antd';
import {useMemo} from 'react';

import {buildMenuItems, MenuItemLabels} from '../common/menu-helpers.js';
import style from './style.module.css';

export interface ICategoryMenuViewProps {
  loading: boolean;
  categories: Category[];
  menuItemLabels: MenuItemLabels;
}

export function CategoryMenuView({
  loading,
  categories,
  menuItemLabels,
}: ICategoryMenuViewProps) {
  const menuItems = useMemo(
    () =>
      buildMenuItems({
        categories,
        iconClassName: style.icon,
        itemLabels: menuItemLabels,
      }),
    [categories, menuItemLabels],
  );

  return (
    <Spin spinning={loading} size={'small'}>
      <Menu
        className={style.CategoryMenu}
        mode={'inline'}
        selectable={false}
        items={menuItems}
      />
    </Spin>
  );
}
