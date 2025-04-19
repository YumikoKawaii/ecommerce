import { Layout, Menu, Avatar, Dropdown, Typography, Badge, Breadcrumb } from 'antd';
import {
    AppstoreOutlined,
    TagsOutlined,
    GiftOutlined,
    TeamOutlined,
    UserOutlined,
    BellOutlined,
    LogoutOutlined,
    SettingOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import bamboo from '../assets/bamboo.png';
import { useState, useEffect } from 'react';
import '../css/AdmintLayout.css';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [pageTitle, setPageTitle] = useState('Dashboard');

    // Set default collapsed state based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update page title based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/products')) setPageTitle('Products Management');
        else if (path.includes('/categories')) setPageTitle('Categories Management');
        else if (path.includes('/coupons')) setPageTitle('Coupons Management');
        else if (path.includes('/suppliers')) setPageTitle('Suppliers Management');
        else setPageTitle('Dashboard');
    }, [location]);

    // Generate breadcrumb items
    const getBreadcrumbItems = () => {
        const path = location.pathname;
        const items = [{ title: <Link to="/">Home</Link> }];

        if (path !== '/') {
            const segment = path.split('/')[1];
            items.push({
                title: segment.charAt(0).toUpperCase() + segment.slice(1)
            });
        }

        return items;
    };

    // Dummy user data, replace with actual user context or API call
    const user = {
        name: 'Yumiko Sturluson',
        avatar: 'https://pbs.twimg.com/profile_images/1494391541695225859/LlAb2Pmy_400x400.jpg',
        role: 'Administrator'
    };

    const handleMenuClick = (e: any) => {
        // Handle menu item click, such as logout or profile
        if (e.key === 'logout') {
            console.log('Logging out...');
        }
    };

    const userMenu = (
        <Menu onClick={handleMenuClick}>
            <div className="user-menu-header">
                <Typography.Text strong>{user.name}</Typography.Text>
                <Typography.Text type="secondary" className="user-role">{user.role}</Typography.Text>
            </div>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                My Profile
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout className="admin-layout">
            <Sider
                width={240}
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="admin-sider"
                theme="light"
            >
                <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
                    <img
                        src={bamboo}
                        alt="Logo"
                        className={`logo-image ${collapsed ? 'collapsed' : ''}`}
                    />
                    {!collapsed && (
                        <Typography.Text strong className="logo-text">
                            Bamboo Rattan
                        </Typography.Text>
                    )}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultSelectedKeys={['/products']}
                    className="admin-menu bamboo-menu"
                    theme="light"
                >
                    <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="/products" icon={<AppstoreOutlined />}>
                        <Link to="/admin/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key="/categories" icon={<TagsOutlined />}>
                        <Link to="/admin/categories">Categories</Link>
                    </Menu.Item>
                    <Menu.Item key="/coupons" icon={<GiftOutlined />}>
                        <Link to="/admin/coupons">Coupons</Link>
                    </Menu.Item>
                    <Menu.Item key="/suppliers" icon={<TeamOutlined />}>
                        <Link to="/admin/suppliers">Suppliers</Link>
                    </Menu.Item>
                </Menu>

                {!collapsed && (
                    <div className="help-box">
                        <Typography.Text strong className="help-title">Need Help?</Typography.Text>
                        <Typography.Text className="help-text">
                            Check our documentation or contact support for assistance.
                        </Typography.Text>
                    </div>
                )}
            </Sider>

            <Layout
                className="main-layout"
                style={{
                    marginLeft: collapsed ? 80 : 240,
                    width: `calc(100vw - ${collapsed ? 80 : 240}px)`
                }}
            >
                <Header className="admin-header">
                    <div>
                        <Title level={4} className="page-title">{pageTitle}</Title>
                    </div>

                    <div className="header-actions">
                        <Badge count={5} size="small">
                            <BellOutlined className="notification-icon" />
                        </Badge>

                        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                            <div className="user-dropdown">
                                <Avatar
                                    src={user.avatar}
                                    alt={user.name}
                                    className="user-avatar"
                                    size="default"
                                />
                                <span className="user-name">{user.name.split(' ')[0]}</span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <div className="breadcrumb-container">
                    <Breadcrumb items={getBreadcrumbItems()} />
                </div>

                <Content className="admin-content">
                    {children}
                </Content>

                <Footer className="admin-footer">
                    <Typography.Text type="secondary">
                        Bamboo Rattan Admin ©{new Date().getFullYear()} - Created with ❤️ for Quality Management
                    </Typography.Text>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;