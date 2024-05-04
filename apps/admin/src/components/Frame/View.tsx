import {DashboardFilled, PoweroffOutlined} from '@ant-design/icons';
import {Button, Card, Layout} from 'antd';
import {type ButtonProps} from 'antd';
import Link from 'next/link';
import {type ReactNode} from 'react';

import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/config/route';

import {LinkList} from './components/LinkList';
import Style from './Style.module.scss';

const {Header, Content, Footer} = Layout;

interface Props {
    onExitButtonClick: ButtonProps['onClick'];
    children: ReactNode;
}

export function FrameView(props: Props) {
    const {onExitButtonClick, children} = props;
    return (
        <Layout className={Style.Frame}>
            <Header className={Style.header}>
                <Link href={PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX]}>
                    <div className={Style.iconWrapper}>
                        <DashboardFilled className={Style.icon} />
                        <span className={Style.text}>后台管理</span>
                    </div>
                </Link>
                <div className={Style.linkListWrapper}>
                    <LinkList />
                </div>
                <Button
                    type={'link'}
                    className={Style.exitButton}
                    size={'large'}
                    onClick={onExitButtonClick}
                >
                    <PoweroffOutlined />
                    退出登录
                </Button>
            </Header>
            <Layout className={Style.contentLayout}>
                <Content className={Style.content}>
                    <Card className={Style.card} bodyStyle={{height: '100%'}}>
                        {children}
                    </Card>
                </Content>
            </Layout>
            <Footer className={Style.footer}>Created By Soulike</Footer>
        </Layout>
    );
}
