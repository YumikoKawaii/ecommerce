// src/components/MainLayout.tsx
import {Layout, Menu} from 'antd';
import {
    AppstoreOutlined,
    TagsOutlined,
    GiftOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {Link, useLocation} from 'react-router-dom';
import bamboo from '../assets/bamboo.png'

const {Header, Sider, Content} = Layout;

const AdminLayout = ({children}: { children: React.ReactNode }) => {
    const location = useLocation();

    return (
        <Layout style={{minHeight: '100vh', width: '100vw'}}>
            <Sider>
                <div style={{margin: 16, display: 'flex', alignItems: 'center', gap: 8}}>
                    <img
                        src={bamboo}
                        alt="Logo"
                        style={{width: 32, height: 32}}
                    />
                    <span style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                        Sale Bamboo Rattan
                    </span>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                >
                    <Menu.Item key="/products" icon={<AppstoreOutlined/>}>
                        <Link to="/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key="/categories" icon={<TagsOutlined/>}>
                        <Link to="/categories">Categories</Link>
                    </Menu.Item>
                    <Menu.Item key="/coupons" icon={<GiftOutlined/>}>
                        <Link to="/coupons">Coupons</Link>
                    </Menu.Item>
                    <Menu.Item key="/suppliers" icon={<TeamOutlined/>}>
                        <Link to="/suppliers">Suppliers</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{background: '#fff', padding: 0}}/>
                <Content style={{margin: '24px 16px'}}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
