import {
  FileTextFilled,
  InfoCircleOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
  SettingOutlined,
  TagsFilled,
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import {type ReactNode} from 'react';
import {Link} from 'react-router';

import {PAGE_ID, PAGE_ID_TO_ROUTE, ROUTE_TO_PAGE_ID} from '@/config/route';

import styles from './styles.module.css';

const {Content, Sider} = Layout;

interface Props {
  pathname: string;
  children: ReactNode;
}

export function LayoutView(props: Props) {
  const {pathname, children} = props;
  return (
    <Layout className={styles.layout}>
      <Sider width={250} theme={'light'}>
        <Menu
          theme={'light'}
          mode={'inline'}
          selectedKeys={[ROUTE_TO_PAGE_ID[pathname]]}
          items={[
            {
              label: (
                <>
                  <span className={styles.icon}>
                    <FileTextFilled />
                  </span>
                  Article
                </>
              ),
              key: PAGE_ID.MANAGE.BLOG.INDEX,
              children: [
                {
                  label: (
                    <Link
                      to={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD]}
                    >
                      <span className={styles.icon}>
                        <PlusCircleOutlined />
                      </span>
                      Create
                    </Link>
                  ),
                  key: PAGE_ID.MANAGE.BLOG.ARTICLE.ADD,
                },
                {
                  label: (
                    <Link
                      to={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]}
                    >
                      <span className={styles.icon}>
                        <InfoCircleOutlined />
                      </span>
                      Manage
                    </Link>
                  ),
                  key: PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE,
                },
              ],
            },
            {
              label: (
                <>
                  <span className={styles.icon}>
                    <TagsFilled />
                  </span>
                  Article Categories
                </>
              ),
              key: PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX,
              children: [
                {
                  label: (
                    <Link
                      to={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD]}
                    >
                      <span className={styles.icon}>
                        <PlusCircleOutlined />
                      </span>
                      Create
                    </Link>
                  ),
                  key: PAGE_ID.MANAGE.BLOG.CATEGORY.ADD,
                },
                {
                  label: (
                    <Link
                      to={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE]}
                    >
                      <span className={styles.icon}>
                        <InfoCircleOutlined />
                      </span>
                      Manage
                    </Link>
                  ),
                  key: PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE,
                },
              ],
            },
            {
              label: (
                <>
                  <span className={styles.icon}>
                    <SettingOutlined />
                  </span>
                  Settings
                </>
              ),
              key: PAGE_ID.MANAGE.BLOG.OPTION.INDEX,
              children: [
                {
                  label: (
                    <Link
                      to={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]}
                    >
                      <span className={styles.icon}>
                        <ProfileOutlined />
                      </span>
                      About
                    </Link>
                  ),
                  key: PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT],
                },
              ],
            },
          ]}
        />
      </Sider>
      <Content className={styles.content}>{children}</Content>
    </Layout>
  );
}
