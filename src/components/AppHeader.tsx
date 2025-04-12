import { Input, Button, Space, Typography, Row, Col, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined, ShoppingCartOutlined, GlobalOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Title, Text } = Typography;

const AppHeader = () => {
    const isLoggedIn = false;
    const cartItemCount = 3; // Example value

    return (
        <Row align="middle" justify="space-between" style={{ height: '100%', padding: '0 24px' }}>
            {/* Logo */}
            <Col>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    MyStore
                </Title>
            </Col>

            <Col flex="auto" style={{ padding: '20px 40px', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%' }}>
                    <Search
                        placeholder="Search products"
                        onSearch={(value) => console.log(value)}
                        enterButton
                        style={{ width: '100%'}}
                    />
                    <div style={{ color: 'white', fontSize: '12px' }}>
                        <Text style={{height: '100%', display: 'inline', color: 'white', marginRight: '8px' }}>
                            <GlobalOutlined style={{ marginRight: '4px' }} />
                            Giao hàng toàn quốc
                        </Text>
                        <Text style={{height: '100%', display: 'inline', color: 'white', marginRight: '8px' }}>
                            <GlobalOutlined style={{ marginRight: '4px' }} />
                            Giao hàng toàn quốc
                        </Text>
                        <Text style={{height: '100%', display: 'inline', color: 'white', marginRight: '8px' }}>
                            <GlobalOutlined style={{ marginRight: '4px' }} />
                            Giao hàng toàn quốc
                        </Text>
                    </div>
                </div>
            </Col>

            <Col>
                <Space>
                    {isLoggedIn ? (
                        <>
                            <Button icon={<UserOutlined />} type="text" style={{ color: 'white' }}>
                                My Account
                            </Button>
                            <Button icon={<LogoutOutlined />} type="text" style={{ color: 'white' }}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button icon={<LoginOutlined />} type="text" style={{ color: 'white' }}>
                            Login
                        </Button>
                    )}
                </Space>
            </Col>

            {/* Cart Section */}
            <Col>
                <Badge count={cartItemCount} size="small" offset={[0, 0]}>
                    <Button
                        type="text"
                        icon={<ShoppingCartOutlined />}
                        style={{ color: 'white' }}
                    />
                </Badge>
            </Col>
        </Row>
    );
};

export default AppHeader;
