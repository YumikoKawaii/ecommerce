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
import bamboo from '../assets/bamboo.png';
import '../css/FacingLayout.css';

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
        <Menu onClick={handleMenuClick}>
            <div className="user-menu-header">
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
        <Layout className="facing-layout">
            <Header className="facing-header">
                <Row gutter={[24, 8]} style={{ width: '100%' }} align="middle">
                    {/* Main header row - all elements in the same line */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Row gutter={[24, 0]} align="middle">
                            {/* Logo */}
                            <Col xs={24} sm={6} md={5} lg={4}>
                                <div className="logo-container">
                                    <img
                                        src={bamboo}
                                        alt="Logo"
                                        className="logo-image"
                                    />
                                    <Typography.Text
                                        strong
                                        className="logo-text"
                                    >
                                        Bamboo Rattan
                                    </Typography.Text>
                                </div>
                            </Col>

                            {/* Search Box */}
                            <Col xs={16} sm={12} md={13} lg={14}>
                                <div className="search-container">
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
                            <Col xs={4} sm={3} md={3} lg={3} className="user-info">
                                <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                                    <div className="user-dropdown">
                                        <Avatar
                                            src={user.avatar}
                                            alt={user.name}
                                            className="user-avatar"
                                            size={32}
                                        />
                                        <span className="user-name">
                                            {user.name.split(' ')[0]}
                                        </span>
                                    </div>
                                </Dropdown>
                            </Col>

                            {/* Cart Info */}
                            <Col xs={4} sm={3} md={3} lg={3} className="user-info">
                                <Badge count={cartItems} size="small">
                                    <Link to="/cart" className="cart-link">
                                        <ShoppingCartOutlined className="cart-icon" />
                                    </Link>
                                </Badge>
                            </Col>
                        </Row>
                    </Col>

                    {/* Marketing info row */}
                    <Col xs={24} sm={24} md={24} lg={24} className="marketing-row">
                        <Row>
                            <Col xs={0} sm={6} md={5} lg={4}>
                                {/* Empty space matching logo column */}
                            </Col>
                            <Col xs={24} sm={18} md={19} lg={20}>
                                <div className="marketing-container">
                                    <div className="marketing-item">
                                        <CarOutlined className="marketing-icon" />
                                        <Text className="marketing-text">Nationwide delivery</Text>
                                    </div>
                                    <div className="marketing-item">
                                        <PhoneOutlined className="marketing-icon" />
                                        <Text className="marketing-text">Hotline: 1900 63 64 76</Text>
                                    </div>
                                    <div className="marketing-item">
                                        <ClockCircleOutlined className="marketing-icon" />
                                        <Text className="marketing-text">9 AM – 9 PM</Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Header>

            <Content className="facing-content">
                {children}
            </Content>

            <Footer className="facing-footer">
                <div className="footer-container">
                    <div>
                        <Typography.Title level={5} className="footer-title">Bamboo Rattan</Typography.Title>
                        <Typography.Paragraph className="footer-text">
                            Sustainable and beautiful products for your home.
                        </Typography.Paragraph>
                    </div>

                    <div>
                        <Typography.Title level={5} className="footer-title">Quick Links</Typography.Title>
                        <div className="footer-links">
                            <Link to="/">Home</Link>
                            <Link to="/products">Products</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <Typography.Title level={5} className="footer-title">Customer Service</Typography.Title>
                        <div className="footer-links">
                            <Link to="/faq">FAQ</Link>
                            <Link to="/shipping">Shipping Info</Link>
                            <Link to="/returns">Returns</Link>
                            <Link to="/support">Support</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-divider">
                    <Typography.Text type="secondary">
                        Bamboo Rattan ©{new Date().getFullYear()} - All Rights Reserved
                    </Typography.Text>
                </div>
            </Footer>
        </Layout>
    );
};

export default FacingLayout;