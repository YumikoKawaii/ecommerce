// src/components/MainLayout.tsx
import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    TagsOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    return (
        <Layout style={{ minHeight: '100vh', width: '100vw' }}>
            <Sider>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: 'white', lineHeight: '32px', fontWeight: 'bold' }}>
                    My Shop
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                >
                    <Menu.Item key="/products" icon={<AppstoreOutlined />}>
                        <Link to="/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key="/categories" icon={<TagsOutlined />}>
                        <Link to="/categories">Categories</Link>
                    </Menu.Item>
                    <Menu.Item key="/coupons" icon={<TagsOutlined />}>
                        <Link to="/coupons">Coupons</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} />
                <Content style={{ margin: '24px 16px' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
