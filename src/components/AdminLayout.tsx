import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import {
    AppstoreOutlined,
    TagsOutlined,
    GiftOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import bamboo from '../assets/bamboo.png';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    // Dummy user data, replace with actual user context or API call
    const user = {
        name: 'Yumiko Sturluson',
        avatar: 'https://pbs.twimg.com/profile_images/1494391541695225859/LlAb2Pmy_400x400.jpg',
    };

    const handleMenuClick = (e: any) => {
        // Handle menu item click, such as logout or profile
        if (e.key === 'logout') {
            console.log('Logging out...');
        }
    };

    const userMenu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="profile">
                Profile
            </Menu.Item>
            <Menu.Item key="logout">
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ minHeight: '100vh', width: '100vw' }}>
            <Sider
                width={240}
                style={{
                    backgroundColor: '#C4F8CB',
                }}
            >
                <div
                    style={{
                        margin: 16,
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: 'white',
                        backgroundColor: '#72E0AC',
                        borderRadius: 8,
                    }}
                >
                    <img
                        src={bamboo}
                        alt="Logo"
                        style={{ width: 32, height: 32 }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 'bold' }}>
                        Sale Bamboo Rattan
                    </span>
                </div>
                <Menu
                    mode="inline"
                    theme={"dark"}
                    selectedKeys={[location.pathname]}
                    style={{
                        backgroundColor: '#72E0AC',
                        color: '#E5F9E0',
                    }}
                    defaultSelectedKeys={['/products']}
                >
                    <Menu.Item key="/products" icon={<AppstoreOutlined />}>
                        <Link to="/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key="/categories" icon={<TagsOutlined />}>
                        <Link to="/categories">Categories</Link>
                    </Menu.Item>
                    <Menu.Item key="/coupons" icon={<GiftOutlined />}>
                        <Link to="/coupons">Coupons</Link>
                    </Menu.Item>
                    <Menu.Item key="/suppliers" icon={<TeamOutlined />}>
                        <Link to="/suppliers">Suppliers</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#E5F9E0', padding: 0, position: 'relative' }}>
                    {/* Add Avatar to top right */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        right: '24px',
                        transform: 'translateY(-50%)',
                    }}>
                        <Dropdown overlay={userMenu} trigger={['click']}>
                            <Avatar
                                src={user.avatar}
                                alt={user.name}
                                style={{ cursor: 'pointer' }}
                                icon={<UserOutlined />}
                            />
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ backgroundColor: "#E5F9E0", padding: "16px 24px" }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
