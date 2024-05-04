import {
  FileTextFilled,
  InfoCircleOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
  SettingOutlined,
  TagsFilled,
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import Link from 'next/link';
import {type ReactNode} from 'react';

import {PAGE_ID, PAGE_ID_TO_ROUTE, ROUTE_TO_PAGE_ID} from '@/config/route';

import Style from './Style.module.scss';

const {Content, Sider} = Layout;

interface Props {
  pathname: string;
  children: ReactNode;
}

export function BlogFrameView(props: Props) {
  const {pathname, children} = props;
  return (
    <Layout className={Style.BlogFrame}>
      <Sider width={250} theme={'light'}>
        <Menu
          theme={'light'}
          mode={'inline'}
          selectedKeys={[ROUTE_TO_PAGE_ID[pathname]]}
          items={[
            {
              label: (
                <>
                  <span className={Style.icon}>
                    <FileTextFilled />
                  </span>
                  文章
                </>
              ),
              key: PAGE_ID.MANAGE.BLOG.INDEX,
              children: [
                {
                  label: (
                    <Link
                      href={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD]}
                    >
                      <span className={Style.icon}>
                        <PlusCircleOutlined />
                      </span>
                      添加
                    </Link>
                  ),
                  key: PAGE_ID.MANAGE.BLOG.ARTICLE.ADD,
                },
                {
                  label: (
                    <Link
                      href={
                        PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]
                      }
                    >
                      <span className={Style.icon}>
                        <InfoCircleOutlined />
                      </span>
                      管理
                    </Link>
                  ),
                  key: PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE,
                },
              ],
            },
            {
              label: (
                <>
                  <span className={Style.icon}>
                    <TagsFilled />
                  </span>
                  文章分类
                </>
              ),
              key: PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX,
              children: [
                {
                  label: (
                    <Link
                      href={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD]}
                    >
                      <span className={Style.icon}>
                        <PlusCircleOutlined />
                      </span>
                      添加
                    </Link>
                  ),
                  key: PAGE_ID.MANAGE.BLOG.CATEGORY.ADD,
                },
                {
                  label: (
                    <Link
                      href={
                        PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE]
                      }
                    >
                      <span className={Style.icon}>
                        <InfoCircleOutlined />
                      </span>
                      管理
                    </Link>
                  ),
                  key: PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE,
                },
              ],
            },
            {
              label: (
                <>
                  <span className={Style.icon}>
                    <SettingOutlined />
                  </span>
                  设置
                </>
              ),
              key: PAGE_ID.MANAGE.BLOG.OPTION.INDEX,
              children: [
                {
                  label: (
                    <Link
                      href={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]}
                    >
                      <span className={Style.icon}>
                        <ProfileOutlined />
                      </span>
                      关于
                    </Link>
                  ),
                  key: PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT],
                },
              ],
            },
          ]}
        />
      </Sider>
      <Content className={Style.content}>{children}</Content>
    </Layout>
  );
}
