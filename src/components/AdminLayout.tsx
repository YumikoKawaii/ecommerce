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
import haru_bamboo from '../assets/haru_bamboo.png';
import { useState, useEffect } from 'react';

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
            <div className="admin-user-menu-header">
                <Typography.Text strong>{user.name}</Typography.Text>
                <Typography.Text type="secondary" className="admin-user-role">{user.role}</Typography.Text>
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
        <Layout className="admin-main-layout">
            <Sider
                width={240}
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="admin-sidebar"
                theme="light"
            >
                <Link to="/" >
                    <div className={`admin-logo-container ${collapsed ? 'admin-collapsed' : ''}`}>
                        <img
                            src={haru_bamboo}
                            alt="Logo"
                            className={`admin-logo-image ${collapsed ? 'admin-collapsed' : ''}`}
                        />
                    </div>
                </Link>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultSelectedKeys={['/products']}
                    className="admin-nav-menu bamboo-menu"
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

            </Sider>

            <Layout
                className="admin-content-layout"
                style={{
                    marginLeft: collapsed ? 80 : 240,
                    width: `calc(100vw - ${collapsed ? 80 : 240}px)`
                }}
            >
                <Header className="admin-top-header">
                    <div>
                        <Title level={4} className="admin-page-title">{pageTitle}</Title>
                    </div>

                    <div className="admin-header-actions">
                        <Badge count={5} size="small">
                            <BellOutlined className="admin-notification-icon" />
                        </Badge>

                        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                            <div className="admin-user-dropdown">
                                <Avatar
                                    src={user.avatar}
                                    alt={user.name}
                                    className="admin-user-avatar"
                                    size="default"
                                />
                                <span className="admin-user-name">{user.name.split(' ')[0]}</span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <div className="admin-breadcrumb-container">
                    <Breadcrumb items={getBreadcrumbItems()} />
                </div>

                <Content className="admin-main-content">
                    {children}
                </Content>

                <Footer className="admin-bottom-footer">
                    <Typography.Text type="secondary">
                        Bamboo Rattan Admin ©{new Date().getFullYear()} - Created with ❤️ for Quality Management
                    </Typography.Text>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;