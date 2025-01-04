import {DashboardFilled, PoweroffOutlined} from '@ant-design/icons';
import {Button, type ButtonProps, Card, Layout} from 'antd';
import {type ReactNode} from 'react';
import {Link} from 'react-router';

import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/config/route';

import {NavigationMenu} from './components/navigation-menu';
import styles from './styles.module.css';

const {Header, Content, Footer} = Layout;

interface Props {
  onExitButtonClick: ButtonProps['onClick'];
  children: ReactNode;
}

export function LayoutView(props: Props) {
  const {onExitButtonClick, children} = props;
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Link to={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX]}>
          <div className={styles.iconContainer}>
            <DashboardFilled className={styles.icon} />
            <span className={styles.text}>Website Admin</span>
          </div>
        </Link>
        <div className={styles.navigationMenuContainer}>
          <NavigationMenu />
        </div>
        <Button
          type={'link'}
          className={styles.exitButton}
          size={'large'}
          onClick={onExitButtonClick}
        >
          <PoweroffOutlined />
          Logout
        </Button>
      </Header>
      <Layout className={styles.contentLayout}>
        <Content className={styles.content}>
          <Card className={styles.card} styles={{body: {height: '100%'}}}>
            {children}
          </Card>
        </Content>
      </Layout>
      <Footer className={styles.footer}>Created By Soulike</Footer>
    </Layout>
  );
}
