import { Layout, Menu, Input, Badge, Avatar, Dropdown, Typography, Space, Row, Col } from 'antd';
import {
    UserOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    LogoutOutlined,
    SettingOutlined,
    SearchOutlined,
    PhoneOutlined,
    CarOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
// Import the bamboo logo the same way as AdminLayout
import bamboo from '../assets/bamboo.png';

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const FacingLayout = ({ children }) => {
    // Dummy user data, replace with actual user context or API call
    const user = {
        name: 'Yumiko Sturluson',
        avatar: 'https://pbs.twimg.com/profile_images/1494391541695225859/LlAb2Pmy_400x400.jpg',
    };

    const [cartItems, setCartItems] = useState(3); // Example state for cart items

    const handleMenuClick = (e) => {
        // Handle menu item click, such as logout or profile
        if (e.key === 'logout') {
            console.log('Logging out...');
        }
    };

    const userMenu = (
        <Menu onClick={handleMenuClick} style={{ padding: '5px 0' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', marginBottom: '5px' }}>
                <Typography.Text strong>{user.name}</Typography.Text>
            </div>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                My Profile
            </Menu.Item>
            <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
                My Orders
            </Menu.Item>
            <Menu.Item key="wishlist" icon={<HeartOutlined />}>
                Wishlist
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
            <Header style={{
                background: '#F3F5E6',
                padding: '12px 50px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                height: 'auto',
                position: 'sticky',
                top: 0,
                zIndex: 5
            }}>
                <Row gutter={[24, 8]} style={{ width: '100%' }} align="middle">
                    {/* Main header row - all elements in the same line */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Row gutter={[24, 0]} align="middle">
                            {/* Logo */}
                            <Col xs={24} sm={6} md={5} lg={4}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        gap: 12,
                                        padding: '6px 12px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #8BC34A 0%, #558B2F 100%)',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        maxWidth: '200px'
                                    }}
                                >
                                    <img
                                        src={bamboo}
                                        alt="Logo"
                                        style={{
                                            width: 28,
                                            height: 28
                                        }}
                                    />
                                    <Typography.Text
                                        strong
                                        style={{
                                            fontSize: 16,
                                            color: 'white',
                                            margin: 0,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontFamily: "'Trebuchet MS', sans-serif",
                                            letterSpacing: '0.5px',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        Bamboo Rattan
                                    </Typography.Text>
                                </div>
                            </Col>

                            {/* Search Box (larger) */}
                            <Col xs={16} sm={12} md={13} lg={14}>
                                <div style={{ height: '40px' }}>
                                    <Search
                                        placeholder="Search for products..."
                                        allowClear
                                        enterButton={<SearchOutlined />}
                                        size="large"
                                        className="bamboo-search"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </Col>

                            {/* User Info */}
                            <Col xs={4} sm={3} md={3} lg={3} style={{ textAlign: 'right', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '24px',
                                        transition: 'all 0.3s',
                                        justifyContent: 'flex-end',
                                        height: '40px'
                                    }}>
                                        <Avatar
                                            src={user.avatar}
                                            alt={user.name}
                                            style={{
                                                border: '2px solid #E8EECC',
                                            }}
                                            size={32}
                                        />
                                        <span style={{
                                            fontWeight: 500,
                                            color: '#558B2F',
                                            display: { xs: 'none', md: 'inline' }
                                        }}>
                      {user.name.split(' ')[0]}
                    </span>
                                    </div>
                                </Dropdown>
                            </Col>

                            {/* Cart Info */}
                            <Col xs={4} sm={3} md={3} lg={3} style={{ textAlign: 'right', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Badge count={cartItems} size="small">
                                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                                        <ShoppingCartOutlined style={{ fontSize: '28px', color: '#558B2F' }} />
                                    </Link>
                                </Badge>
                            </Col>
                        </Row>
                    </Col>

                    {/* Marketing info row */}
                    <Col xs={24} sm={24} md={24} lg={24} style={{ marginTop: '2px' }}>
                        <Row>
                            <Col xs={0} sm={6} md={5} lg={4}>
                                {/* Empty space matching logo column */}
                            </Col>
                            <Col xs={24} sm={18} md={19} lg={20}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    gap: '16px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CarOutlined style={{ color: '#558B2F' }} />
                                        <Text style={{ color: '#558B2F', fontSize: '12px', whiteSpace: 'nowrap' }}>Nationwide delivery</Text>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <PhoneOutlined style={{ color: '#558B2F' }} />
                                        <Text style={{ color: '#558B2F', fontSize: '12px', whiteSpace: 'nowrap' }}>Hotline: 1900 63 64 76</Text>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ClockCircleOutlined style={{ color: '#558B2F' }} />
                                        <Text style={{ color: '#558B2F', fontSize: '12px', whiteSpace: 'nowrap' }}>9 AM – 9 PM</Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Header>

            <Content style={{
                background: '#FAFBF0',
                minHeight: 'calc(100vh - 134px)', // Adjust for header + footer
            }}>
                {children}
            </Content>

            <Footer style={{
                textAlign: 'center',
                padding: '24px 50px',
                background: '#F3F5E6',
                borderTop: '1px solid #E8EECC'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
                    <div>
                        <Typography.Title level={5} style={{ color: '#558B2F' }}>Bamboo Rattan</Typography.Title>
                        <Typography.Paragraph style={{ color: '#7D9867' }}>
                            Sustainable and beautiful products for your home.
                        </Typography.Paragraph>
                    </div>

                    <div>
                        <Typography.Title level={5} style={{ color: '#558B2F' }}>Quick Links</Typography.Title>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Link to="/">Home</Link>
                            <Link to="/products">Products</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <Typography.Title level={5} style={{ color: '#558B2F' }}>Customer Service</Typography.Title>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Link to="/faq">FAQ</Link>
                            <Link to="/shipping">Shipping Info</Link>
                            <Link to="/returns">Returns</Link>
                            <Link to="/support">Support</Link>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '24px', borderTop: '1px solid #E8EECC', paddingTop: '16px' }}>
                    <Typography.Text type="secondary">
                        Bamboo Rattan ©{new Date().getFullYear()} - All Rights Reserved
                    </Typography.Text>
                </div>
            </Footer>
        </Layout>
    );
};

export default FacingLayout;