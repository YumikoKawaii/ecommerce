import { Layout, Menu, Input, Badge, Avatar, Dropdown, Typography, Row, Col } from 'antd';
import {
    UserOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    LogoutOutlined,
    SearchOutlined,
    PhoneOutlined,
    CarOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import haru_bamboo from '../assets/haru_bamboo.png';

const { Header, Footer, Content } = Layout;
const { Text } = Typography;
const { Search } = Input;

const FacingLayout = ({ children }) => {
    const navigate = useNavigate(); // Add this to use navigation

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
        } else if (e.key === 'profile') {
            navigate('/profile'); // Navigate to profile page when clicked
        } else if (e.key === 'orders') {
            navigate('/orders');
        } else if (e.key === 'wishlist') {
            navigate('/wishlist');
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
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout className="facing-layout">
            <Header className="facing-header">
                <Row gutter={[24, 8]} style={{ width: '100%' }}>
                    <Col xs={24} sm={6} md={5} lg={4} className="logo-column">
                        <div className="logo-container">
                            <Link to="/" >
                                <img
                                    src={haru_bamboo}
                                    alt="Haru Bamboo Logo"
                                    className="logo-image"
                                />
                            </Link>
                        </div>
                    </Col>

                    <Col xs={24} sm={18} md={19} lg={20}>
                        {/* First row: Search, User, Cart */}
                        <Row gutter={[16, 0]} align="middle" className="header-top-row">
                            {/* Search Box */}
                            <Col xs={16} sm={18} md={18} lg={18}>
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

                            {/* Cart Info */}
                            <Col xs={4} sm={3} md={3} lg={3} className="user-info">
                                <Badge count={cartItems} size="small">
                                    <Link to="/cart" className="cart-link">
                                        <ShoppingCartOutlined className="cart-icon" />
                                    </Link>
                                </Badge>
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
                        </Row>

                        {/* Second row: Marketing info */}
                        <Row className="marketing-row">
                            <Col span={24}>
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