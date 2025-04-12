// src/layout/AppLayout.tsx
import { Layout } from 'antd';
import AppHeader from '../components/AppHeader';
import { PropsWithChildren } from 'react';

const { Header, Content } = Layout;

const AppLayout = ({ children }: PropsWithChildren) => {
    return (
        <Layout style={{ minHeight: '100vh', width: '100%' }}>
            <Header style={{ background: '#40C9A2', padding: 0, height: '120px'}}>
                <AppHeader />
            </Header>
            <Content style={{ padding: '24px' }}>
                {children}
            </Content>
        </Layout>
    );
};

export default AppLayout;
