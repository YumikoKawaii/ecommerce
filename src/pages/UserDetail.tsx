import { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Card,
    Row,
    Col,
    Avatar,
    Space,
    Button,
    Divider,
    Skeleton,
    notification,
    Tabs,
    Badge,
    Empty,
    Modal,
    Form,
    Input,
    Upload,
    message
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    EditOutlined,
    LockOutlined,
    SettingOutlined,
    BellOutlined,
    ShoppingOutlined,
    HeartOutlined,
    CalendarOutlined,
    UploadOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import FacingLayout from '../components/FacingLayout';
import { fetchUser } from "../services/usersService";
import { User } from "../types/types"; // Adjust import path as needed
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const UserDetail = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                // Call your fetchUser function
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                notification.error({
                    message: 'Failed to load user data',
                    description: error.message || 'Please try again later',
                });
            } finally {
                setLoading(false);
            }
        };

        loadUser();

        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    // Set initial form values when user data is loaded
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
            });

            // Set file list if user has an image
            if (user.imageUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'profile-image.png',
                        status: 'done',
                        url: user.imageUrl,
                    },
                ]);
            }
        }
    }, [user, form]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    // Open edit profile modal
    const handleEditProfile = () => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
            });

            // Set file list if user has an image
            if (user.imageUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'profile-image.png',
                        status: 'done',
                        url: user.imageUrl,
                    },
                ]);
            } else {
                setFileList([]);
            }
        }

        setIsEditModalOpen(true);
    };

    // Handle form submission for profile edit
    const handleProfileUpdate = async () => {
        try {
            const values = await form.validateFields();
            setUploading(true);

            // Get image URL - in a real app, this would involve an actual file upload
            let imageUrl = user?.imageUrl || '';

            if (fileList.length > 0) {
                if (fileList[0].originFileObj) {
                    // This is a new file to upload
                    // In a real app, this would be an API call
                    await new Promise(resolve => setTimeout(resolve, 800)); // Fake upload delay
                    imageUrl = URL.createObjectURL(fileList[0].originFileObj);
                } else if (fileList[0].url) {
                    // Keep existing image
                    imageUrl = fileList[0].url;
                }
            }

            // Create updated user object
            const updatedUser: User = {
                ...user!,
                username: values.username,
                email: values.email,
                phoneNumber: values.phoneNumber,
                address: values.address,
                imageUrl: imageUrl,
            };

            // Here you would make an API call to update the user
            // For now, we'll just update the local state
            setUser(updatedUser);

            message.success('Profile updated successfully');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Form validation failed:", error);
        } finally {
            setUploading(false);
        }
    };

    // Handle file change for avatar upload
    const handleFileChange = (info: UploadChangeParam) => {
        // Update the fileList with what the Upload component provides
        setFileList(info.fileList.slice(-1)); // Only keep the latest file

        if (info.fileList.length === 0) {
            // Reset the file field completely to allow new uploads
            setUploading(false);
        } else if (info.fileList[0]?.originFileObj) {
            // If this is a new file, create a preview
            const file = info.fileList[0];
            const previewUrl = URL.createObjectURL(file.originFileObj);

            // Update the file with the preview URL
            const updatedFileList = [{
                ...file,
                thumbUrl: previewUrl,
                status: 'done', // Mark as done to show preview
            }];

            setFileList(updatedFileList);
        }
    };

    // Upload props configuration
    const uploadProps: UploadProps = {
        onRemove: () => {
            setFileList([]); // Clear the fileList when removing
        },
        beforeUpload: (file) => {
            // Validate file type
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
                return Upload.LIST_IGNORE;
            }

            // Validate file size
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('Image must be smaller than 5MB!');
                return Upload.LIST_IGNORE;
            }

            return false; // Prevent default upload
        },
        onChange: handleFileChange,
        fileList,
        listType: 'picture-card',
        maxCount: 1,
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: true,
        },
        // Simulate immediate upload completion for demo
        customRequest: ({ onSuccess }) => {
            setTimeout(() => {
                onSuccess?.("ok", undefined as never);
            }, 0);
        },
    };

    // Profile Information Card
    const renderProfileCard = () => (
        <Card
            bordered={true}
            style={{
                borderRadius: '12px',
                borderColor: '#E8EECC',
                boxShadow: '0 4px 12px rgba(139, 195, 74, 0.1)',
                overflow: 'hidden'
            }}
            bodyStyle={{ padding: '0' }}
        >
            {/* Header Banner */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #8BC34A 0%, #558B2F 100%)',
                    height: '120px',
                    position: 'relative'
                }}
            />

            {loading ? (
                <div style={{ padding: '24px' }}>
                    <Skeleton active avatar={{ size: 84, shape: 'circle' }} paragraph={{ rows: 6 }} />
                </div>
            ) : (
                <>
                    {/* User Profile Section */}
                    <div style={{ padding: '0 24px 24px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            marginTop: '-50px',
                            flexWrap: 'wrap'
                        }}>
                            <Avatar
                                size={100}
                                src={user?.imageUrl}
                                icon={<UserOutlined />}
                                style={{
                                    backgroundColor: '#8BC34A',
                                    border: '4px solid #FFFFFF',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                }}
                            />
                            <div style={{
                                marginLeft: '20px',
                                flex: 1,
                                minWidth: '200px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: '12px'
                                }}>
                                    <div>
                                        <Title level={3} style={{ marginBottom: '0', color: '#558B2F' }}>
                                            {user?.username}
                                        </Title>
                                        <Text type="secondary">User ID: {user?.id}</Text>
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={handleEditProfile}
                                        style={{
                                            background: 'linear-gradient(135deg, #8BC34A 0%, #558B2F 100%)',
                                            border: 'none',
                                            boxShadow: '0 2px 6px rgba(139, 195, 74, 0.4)'
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Divider style={{ borderColor: '#E8EECC', margin: '24px 0 16px' }} />

                        {/* User Details Grid */}
                        <Row gutter={[24, 16]}>
                            <Col xs={24} md={8}>
                                <Card
                                    className="stats-card stats-card-green"
                                    bordered={false}
                                    style={{ height: '100%' }}
                                >
                                    <div className="stats-content">
                                        <div>
                                            <Text type="secondary">
                                                <MailOutlined style={{ marginRight: '8px', color: '#75A742' }} />
                                                Email
                                            </Text>
                                            <Paragraph style={{
                                                margin: '8px 0 0',
                                                fontSize: '16px',
                                                wordBreak: 'break-word'
                                            }}>
                                                {user?.email}
                                            </Paragraph>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} md={8}>
                                <Card
                                    className="stats-card stats-card-default"
                                    bordered={false}
                                    style={{ height: '100%' }}
                                >
                                    <div className="stats-content">
                                        <div>
                                            <Text type="secondary">
                                                <PhoneOutlined style={{ marginRight: '8px', color: '#75A742' }} />
                                                Phone
                                            </Text>
                                            <Paragraph style={{ margin: '8px 0 0', fontSize: '16px' }}>
                                                {user?.phoneNumber || 'Not provided'}
                                            </Paragraph>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} md={8}>
                                <Card
                                    className="stats-card stats-card-green"
                                    bordered={false}
                                    style={{ height: '100%' }}
                                >
                                    <div className="stats-content">
                                        <div>
                                            <Text type="secondary">
                                                <HomeOutlined style={{ marginRight: '8px', color: '#75A742' }} />
                                                Address
                                            </Text>
                                            <Paragraph style={{
                                                margin: '8px 0 0',
                                                fontSize: '16px',
                                                wordBreak: 'break-word'
                                            }}>
                                                {user?.address || 'Not provided'}
                                            </Paragraph>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </Card>
    );

    // Account Settings Card
    const renderSettingsCard = () => (
        <Card
            title={
                <div style={{ color: '#558B2F' }}>
                    <SettingOutlined style={{ marginRight: '8px' }} />
                    Account Settings
                </div>
            }
            style={{
                borderRadius: '12px',
                borderColor: '#E8EECC',
                boxShadow: '0 2px 8px rgba(183, 202, 121, 0.1)',
                marginTop: '24px'
            }}
            headStyle={{
                backgroundColor: '#F1F8E5',
                borderBottom: '2px solid #B7CA79'
            }}
        >
            {loading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Button
                            icon={<LockOutlined />}
                            size="large"
                            block
                            style={{
                                height: 'auto',
                                padding: '12px',
                                textAlign: 'left',
                                borderColor: '#B7CA79',
                                color: '#558B2F',
                                backgroundColor: '#F8F9E8'
                            }}
                        >
                            <div style={{ marginLeft: '8px', display: 'inline-block' }}>
                                <div>Change Password</div>
                                <small style={{ color: '#999' }}>Update your security credentials</small>
                            </div>
                        </Button>
                    </Col>
                    <Col xs={24} md={8}>
                        <Button
                            icon={<SettingOutlined />}
                            size="large"
                            block
                            style={{
                                height: 'auto',
                                padding: '12px',
                                textAlign: 'left',
                                borderColor: '#B7CA79',
                                color: '#558B2F',
                                backgroundColor: '#F8F9E8'
                            }}
                        >
                            <div style={{ marginLeft: '8px', display: 'inline-block' }}>
                                <div>Privacy Settings</div>
                                <small style={{ color: '#999' }}>Manage your data & privacy</small>
                            </div>
                        </Button>
                    </Col>
                    <Col xs={24} md={8}>
                        <Button
                            icon={<BellOutlined />}
                            size="large"
                            block
                            style={{
                                height: 'auto',
                                padding: '12px',
                                textAlign: 'left',
                                borderColor: '#B7CA79',
                                color: '#558B2F',
                                backgroundColor: '#F8F9E8'
                            }}
                        >
                            <div style={{ marginLeft: '8px', display: 'inline-block' }}>
                                <div>Notification Preferences</div>
                                <small style={{ color: '#999' }}>Control how we reach you</small>
                            </div>
                        </Button>
                    </Col>
                </Row>
            )}
        </Card>
    );

    // Orders & Saved Items Cards
    const renderActivityCards = () => (
        <div style={{ marginTop: '24px' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <div style={{ color: '#558B2F', display: 'flex', alignItems: 'center' }}>
                                <ShoppingOutlined style={{ marginRight: '8px', fontSize: '20px' }} />
                                Recent Orders
                            </div>
                        }
                        extra={
                            <Button type="link" style={{ color: '#558B2F', padding: 0 }}>
                                View All
                            </Button>
                        }
                        style={{
                            borderRadius: '12px',
                            borderColor: '#E8EECC',
                            height: '100%'
                        }}
                        headStyle={{
                            backgroundColor: '#F1F8E5',
                            color: '#558B2F',
                            borderBottom: '2px solid #B7CA79'
                        }}
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span style={{ color: '#999' }}>You have no recent orders</span>
                                }
                                style={{ margin: '24px 0' }}
                            >
                                <Button
                                    type="primary"
                                    style={{
                                        background: 'linear-gradient(135deg, #8BC34A 0%, #558B2F 100%)',
                                        border: 'none'
                                    }}
                                >
                                    Start Shopping
                                </Button>
                            </Empty>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title={
                            <div style={{ color: '#558B2F', display: 'flex', alignItems: 'center' }}>
                                <HeartOutlined style={{ marginRight: '8px', fontSize: '20px' }} />
                                Saved Items
                            </div>
                        }
                        extra={
                            <Button type="link" style={{ color: '#558B2F', padding: 0 }}>
                                View All
                            </Button>
                        }
                        style={{
                            borderRadius: '12px',
                            borderColor: '#E8EECC',
                            height: '100%'
                        }}
                        headStyle={{
                            backgroundColor: '#F1F8E5',
                            color: '#558B2F',
                            borderBottom: '2px solid #B7CA79'
                        }}
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span style={{ color: '#999' }}>You have no saved items</span>
                                }
                                style={{ margin: '24px 0' }}
                            >
                                <Button
                                    style={{
                                        borderColor: '#B7CA79',
                                        color: '#558B2F',
                                        backgroundColor: '#F8F9E8'
                                    }}
                                >
                                    Browse Products
                                </Button>
                            </Empty>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );

    return (
        <FacingLayout>
            {/* Edit Profile Modal */}
            <Modal
                open={isEditModalOpen}
                title={
                    <div className="modal-title">
                        <EditOutlined style={{ marginRight: 8 }} /> Edit Profile
                    </div>
                }
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleProfileUpdate}
                okText={uploading ? "Saving..." : "Save Changes"}
                confirmLoading={uploading}
                okButtonProps={{
                    disabled: uploading,
                    className: "save-btn",
                    style: { backgroundColor: '#75A742', borderColor: '#75A742' }
                }}
                cancelButtonProps={{
                    className: "cancel-btn",
                    style: { borderColor: '#DCE8BB', color: '#558B2F' }
                }}
                width={600}
                destroyOnClose
            >
                <Divider style={{ borderColor: '#E8EECC', margin: '0 0 24px 0' }} />

                <Form
                    form={form}
                    layout="vertical"
                >
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Form.Item name="profileImage" style={{ margin: 0 }}>
                            <Upload {...uploadProps}>
                                {fileList.length === 0 ? (
                                    <div>
                                        {uploading ? <LoadingOutlined /> : <UploadOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload Avatar</div>
                                    </div>
                                ) : null}
                            </Upload>
                        </Form.Item>
                        <Typography.Text type="secondary">
                            Upload a square image (JPG or PNG, max 5MB)
                        </Typography.Text>
                    </div>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[{ required: true, message: 'Please enter your username' }]}
                            >
                                <Input prefix={<UserOutlined style={{ color: '#75A742' }} />} placeholder="Username" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input prefix={<MailOutlined style={{ color: '#75A742' }} />} placeholder="Email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please enter your phone number' }]}
                            >
                                <Input prefix={<PhoneOutlined style={{ color: '#75A742' }} />} placeholder="Phone Number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="address"
                                label="Shipping Address"
                                rules={[{ required: true, message: 'Please enter your address' }]}
                            >
                                <Input.TextArea
                                    placeholder="Your shipping address"
                                    rows={3}
                                    style={{ resize: 'none' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Content
                style={{
                    padding: '24px',
                    backgroundColor: '#FAFDF6'
                }}
            >
                <Row justify="center">
                    <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            <Title level={2} style={{ color: '#558B2F', margin: 0 }}>
                                <UserOutlined style={{ marginRight: '12px' }} />
                                My Profile
                            </Title>

                            <Tabs
                                activeKey={activeTab}
                                onChange={handleTabChange}
                                style={{ marginBottom: 0 }}
                                type="card"
                            >
                                <TabPane tab="Profile" key="profile" />
                                <TabPane
                                    tab={
                                        <Badge count={0} dot>
                                            <Space>
                                                <CalendarOutlined />
                                                Activity
                                            </Space>
                                        </Badge>
                                    }
                                    key="activity"
                                />
                            </Tabs>
                        </div>

                        {activeTab === 'profile' ? (
                            <>
                                {renderProfileCard()}
                                {renderSettingsCard()}
                            </>
                        ) : (
                            renderActivityCards()
                        )}
                    </Col>
                </Row>
            </Content>
        </FacingLayout>
    );
};

export default UserDetail;