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
// No need to import the CSS file as it will be in App.css

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [pageTitle, setPageTitle] = useState('Dashboard');

    const menuItemStyle = {
        '& .ant-menu-item-selected': {
            backgroundColor: '#E8EECC !important', // Light bamboo color for selected state
            color: '#558B2F !important', // Darker bamboo green for text
            fontWeight: 'bold'
        },
        '& .ant-menu-item:hover': {
            color: '#75A742 !important' // Medium bamboo green for hover state
        },
        '& .ant-menu-item-selected::after': {
            borderRightColor: '#8BC34A !important' // Bamboo green for the selection indicator
        }
    };

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
        <Menu onClick={handleMenuClick} style={{ padding: '5px 0' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', marginBottom: '5px' }}>
                <Typography.Text strong>{user.name}</Typography.Text>
                <Typography.Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>{user.role}</Typography.Text>
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
        <Layout style={{ minHeight: '100vh', width: '100vw' }}>
            <Sider
                width={240}
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    zIndex: 10,
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    overflowY: 'auto',
                    backgroundColor: '#F8F9E8' // Light bamboo-inspired background
                }}
                theme="light"
            >
                <div
                    style={{
                        margin: '16px auto',
                        padding: collapsed ? '8px' : '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: collapsed ? 0 : 12,
                        width: collapsed ? '80%' : '85%',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #8BC34A 0%, #558B2F 100%)', // Bamboo green gradient
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s'
                    }}
                >
                    <img
                        src={bamboo}
                        alt="Logo"
                        style={{
                            width: collapsed ? 28 : 32,
                            height: collapsed ? 28 : 32,
                            transition: 'all 0.3s'
                        }}
                    />
                    {!collapsed && (
                        <Typography.Text
                            strong
                            style={{
                                fontSize: 16,
                                color: 'white',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            Bamboo Rattan
                        </Typography.Text>
                    )}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultSelectedKeys={['/products']}
                    style={{
                        borderRight: 0,
                        paddingTop: '12px',
                        backgroundColor: '#F8F9E8', // Match sider background
                        ...menuItemStyle
                    }}
                    theme="light"
                    className="bamboo-menu" // Add custom class for additional styling
                >
                    <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
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

                {!collapsed && (
                    <div style={{
                        position: 'absolute',
                        bottom: '60px',  // Increased bottom margin to avoid overlap with collapse button
                        left: '20px',
                        right: '20px',
                        padding: '16px',
                        background: '#ECF3D3', // Light bamboo color
                        borderRadius: '8px',
                        border: '1px solid #B7CA79', // Bamboo stem color
                        zIndex: 1  // Ensure it appears above the collapse button
                    }}>
                        <Typography.Text strong style={{ display: 'block', marginBottom: '4px' }}>Need Help?</Typography.Text>
                        <Typography.Text style={{ fontSize: '12px' }}>
                            Check our documentation or contact support for assistance.
                        </Typography.Text>
                    </div>
                )}
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.3s', width: 'calc(100vw - ' + (collapsed ? 80 : 240) + 'px)' }}>
                <Header style={{
                    background: '#F3F5E6', // Very light bamboo color for header
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                    height: '64px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 5
                }}>
                    <div>
                        <Title level={4} style={{ margin: 0 }}>{pageTitle}</Title>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Badge count={5} size="small">
                            <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                        </Badge>

                        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '24px',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    background: '#f5f5f5'
                                }
                            }}>
                                <Avatar
                                    src={user.avatar}
                                    alt={user.name}
                                    style={{
                                        border: '2px solid #f0f0f0',
                                    }}
                                    size="default"
                                />
                                <span style={{ fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <div style={{ padding: '16px 24px 0', background: '#F3F5E6' }}>
                    <Breadcrumb items={getBreadcrumbItems()} />
                </div>

                <Content style={{
                    margin: '16px',
                    minHeight: 280,
                    background: '#FAFBF0', // Very light bamboo color for content
                    padding: '24px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}>
                    {children}
                </Content>

                <Footer style={{ textAlign: 'center', padding: '12px 50px', background: '#F3F5E6' }}>
                    <Typography.Text type="secondary">
                        Bamboo Rattan Admin ©{new Date().getFullYear()} - Created with ❤️ for Quality Management
                    </Typography.Text>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;