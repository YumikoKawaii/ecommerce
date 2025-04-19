import { useEffect, useState } from "react";
import {
    Input,
    Button,
    Row,
    Col,
    Spin,
    Modal,
    Form,
    Select,
    InputNumber,
    DatePicker,
    message,
    Typography,
    Card,
    Divider,
    Tooltip,
    Badge,
    Table,
    Space,
    Tag
} from "antd";
import {
    PlusOutlined,
    LoadingOutlined,
    SearchOutlined,
    FilterOutlined,
    TagOutlined,
    DollarOutlined,
    GiftOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StopOutlined
} from "@ant-design/icons";
import type { Coupon, Product } from "../types/types";
import { fetchCoupons } from "../services/couponsService";
import { fetchProducts } from "../services/productsService";
import dayjs from "dayjs";
import "../css/AdminCoupons.css";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

const CouponsManage = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [form] = Form.useForm();

    // Function to get coupon status
    const getCouponStatus = (startDate: string, endDate: string) => {
        const today = dayjs();
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (today.isBefore(start)) {
            return {
                status: 'upcoming',
                color: '#8BC34A',
                icon: <ClockCircleOutlined />,
                text: 'Upcoming'
            };
        } else if (today.isAfter(end)) {
            return {
                status: 'expired',
                color: '#9E9E9E',
                icon: <StopOutlined />,
                text: 'Expired'
            };
        } else {
            // Check if expiring soon (within 7 days)
            const daysRemaining = end.diff(today, 'day');
            if (daysRemaining <= 7) {
                return {
                    status: 'expiring',
                    color: '#FF8F00',
                    icon: <ClockCircleOutlined />,
                    text: `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
                };
            } else {
                return {
                    status: 'active',
                    color: '#558B2F',
                    icon: <CheckCircleOutlined />,
                    text: 'Active'
                };
            }
        }
    };

    // Fetch data on mount
    useEffect(() => {
        Promise.all([
            fetchCoupons().then(setCoupons),
            fetchProducts().then(setProducts)
        ])
            .catch((err) => {
                console.error("Failed to fetch data:", err);
                message.error("Failed to load data");
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle search
    const handleSearch = (value: string): void => {
        setSearchTerm(value.toLowerCase());
    };

    // Handle product filter
    const handleProductChange = (value: string | null): void => {
        setSelectedProduct(value);
    };

    // Reset all filters
    const resetFilters = (): void => {
        setSearchTerm("");
        setSelectedProduct(null);
    };

    // Generate a random coupon code
    const generateCouponCode = (): void => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        form.setFieldsValue({ code: result });
    };

    // Open modal for adding a new coupon
    const handleAdd = (): void => {
        setEditingCoupon(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Open modal for editing a coupon
    const handleEdit = (coupon: Coupon): void => {
        setEditingCoupon(coupon);

        // Parse dates from strings to dayjs objects
        const startDate = dayjs(coupon.startDate);
        const endDate = dayjs(coupon.endDate);

        form.setFieldsValue({
            name: coupon.name,
            code: coupon.code,
            productId: coupon.productId,
            discountRate: coupon.discountRate,
            dateRange: [startDate, endDate]
        });

        setIsModalOpen(true);
    };

    // Delete a coupon
    const handleDelete = (coupon: Coupon): void => {
        // In a real app, you would make an API call here
        console.log(`Deleting coupon with ID: ${coupon.id}`);

        // Update local state by removing the deleted coupon
        setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
        message.success(`Coupon "${coupon.name}" deleted`);
    };

    // Handle form submission
    const handleSubmit = async (): Promise<void> => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Extract dates from the range picker
            const [startDate, endDate] = values.dateRange;

            // Prepare coupon data
            const couponData = {
                name: values.name,
                code: values.code,
                productId: values.productId,
                discountRate: values.discountRate,
                startDate: startDate.format("YYYY-MM-DD"),
                endDate: endDate.format("YYYY-MM-DD")
            };

            if (editingCoupon) {
                // Update existing coupon
                const updatedCoupon = {
                    ...editingCoupon,
                    ...couponData,
                };

                setCoupons((prev) =>
                    prev.map((c) => (c.id === editingCoupon.id ? updatedCoupon : c))
                );

                message.success(`Coupon "${updatedCoupon.name}" updated`);
            } else {
                // Create new coupon
                const newCoupon = {
                    ...couponData,
                    id: Date.now(), // In a real app, the server would generate this
                };

                setCoupons((prev) => [...prev, newCoupon]);
                message.success(`Coupon "${newCoupon.name}" created`);
            }

            // Close modal and reset
            setIsModalOpen(false);
            form.resetFields();
            setEditingCoupon(null);
        } catch (error) {
            console.error("Form validation failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Table columns configuration
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center' as const,
            render: (id: number) => (
                <Tag className="id-tag">
                    {id}
                </Tag>
            ),
        },
        {
            title: 'Coupon',
            key: 'coupon',
            width: 300,
            render: (record: Coupon) => {
                const { status, icon, text: statusText } = getCouponStatus(record.startDate, record.endDate);
                const statusTagClass = `status-tag-${status}`;

                return (
                    <div className="coupon-container">
                        <Text strong className="coupon-name">
                            {record.name}
                        </Text>
                        <Tag
                            icon={icon}
                            className={statusTagClass}
                        >
                            {statusText}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            width: 150,
            align: 'center' as const,
            render: (code: string) => (
                <Tag className="code-tag">
                    {code}
                </Tag>
            ),
        },
        {
            title: 'Discount',
            dataIndex: 'discountRate',
            key: 'discountRate',
            width: 120,
            align: 'center' as const,
            render: (rate: number) => (
                <Text strong className="discount-text">
                    {rate}%
                </Text>
            ),
            sorter: (a: Coupon, b: Coupon) => a.discountRate - b.discountRate,
        },
        {
            title: 'Product',
            dataIndex: 'productId',
            key: 'productId',
            width: 200,
            align: 'center' as const,
            render: (productId: number) => {
                const product = products.find((prod) => prod.id === productId);
                return product ? (
                    <Tag className="product-tag">
                        {product.name}
                    </Tag>
                ) : '';
            },
            filters: products.map(prod => ({ text: prod.name, value: prod.id })),
            onFilter: (value: number, record: Coupon) => record.productId === value,
        },
        {
            title: 'Validity Period',
            key: 'validity',
            width: 200,
            align: 'center' as const,
            render: (_: never, record: Coupon) => {
                const start = dayjs(record.startDate).format('MMM D, YYYY');
                const end = dayjs(record.endDate).format('MMM D, YYYY');
                const today = dayjs();
                const endDate = dayjs(record.endDate);
                const daysRemaining = endDate.diff(today, 'day');

                let badgeColor = '#52c41a'; // Green for good days remaining
                if (daysRemaining <= 0) {
                    badgeColor = '#9E9E9E'; // Grey for expired
                } else if (daysRemaining <= 7) {
                    badgeColor = '#ff4d4f'; // Red for close to expiry
                } else if (daysRemaining <= 14) {
                    badgeColor = '#faad14'; // Yellow for approaching expiry
                }

                return (
                    <Space direction="vertical" size="small" className="validity-container">
                        <Space className="validity-dates">
                            <Text>
                                {start} <span className="date-separator">to</span> {end}
                            </Text>
                        </Space>
                        {!today.isAfter(endDate) && (
                            <Badge
                                color={badgeColor}
                                text={
                                    <Text className="days-remaining" style={{ color: badgeColor }}>
                                        {daysRemaining <= 0
                                            ? 'Expired'
                                            : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`}
                                    </Text>
                                }
                            />
                        )}
                    </Space>
                );
            },
            sorter: (a: Coupon, b: Coupon) => dayjs(a.endDate).unix() - dayjs(b.endDate).unix(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'center' as const,
            render: (_: unknown, record: Coupon) => {
                return (
                    <Space size="middle">
                        <Tooltip title="Edit">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                                className="edit-button"
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Button
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record)}
                                className="delete-button"
                            />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    // Filter coupons based on search term and selected filters
    const filteredCoupons = coupons.filter((coupon) => {
        // Filter by search term
        const matchesSearch =
            coupon.name.toLowerCase().includes(searchTerm) ||
            coupon.code.toLowerCase().includes(searchTerm);

        // Filter by product if selected
        const matchesProduct = selectedProduct
            ? coupon.productId.toString() === selectedProduct
            : true;

        return matchesSearch && matchesProduct;
    });

    // Calculate stats
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter((coupon) => {
        const currentDate = dayjs().format("YYYY-MM-DD");
        return currentDate >= coupon.startDate && currentDate <= coupon.endDate;
    }).length;
    const expiringCoupons = coupons.filter((coupon) => {
        const currentDate = dayjs();
        const endDate = dayjs(coupon.endDate);
        const daysRemaining = endDate.diff(currentDate, "day");
        return daysRemaining >= 0 && daysRemaining <= 7;
    }).length;

    if (loading) {
        return (
            <div className="loading-container">
                <Spin
                    tip="Loading coupons..."
                    size="large"
                    className="loading-spin"
                    indicator={
                        <LoadingOutlined className="loading-icon" spin />
                    }
                />
            </div>
        );
    }

    return (
        <div className="coupons-section">
            <div className="coupons-header">
                <Title level={4} className="page-title">
                    Coupons Management
                </Title>

                {/* Stats Cards */}
                <Row gutter={16} className="stats-row">
                    <Col xs={24} sm={8}>
                        <Card className="stats-card stats-card-default">
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Total Coupons</Text>
                                    <Title level={3} className="stats-value">
                                        {totalCoupons}
                                    </Title>
                                </div>
                                <TagOutlined className="stats-icon" />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="stats-card stats-card-green">
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Active Coupons</Text>
                                    <Title level={3} className="stats-value">
                                        {activeCoupons}
                                    </Title>
                                </div>
                                <GiftOutlined className="stats-icon" />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className={`stats-card ${expiringCoupons > 0 ? 'stats-card-warning' : 'stats-card-green'}`}>
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Expiring Soon</Text>
                                    <Title level={3} className={expiringCoupons > 0 ? "stats-value-warning" : "stats-value"}>
                                        {expiringCoupons}
                                    </Title>
                                </div>
                                <Badge
                                    count={expiringCoupons}
                                    color={expiringCoupons > 0 ? "#FF8F00" : "#8BC34A"}
                                >
                                    <DollarOutlined className={expiringCoupons > 0 ? "stats-icon-warning" : "stats-icon"} />
                                </Badge>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card className="filters-card">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={12} lg={8}>
                            <Input.Search
                                placeholder="Search coupons by name or code"
                                allowClear
                                enterButton={<SearchOutlined />}
                                onSearch={handleSearch}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: "100%" }}
                                className="bamboo-search"
                            />
                        </Col>

                        <Col xs={24} md={12} lg={10}>
                            <Select
                                placeholder="Filter by Product"
                                style={{ width: "100%" }}
                                allowClear
                                value={selectedProduct}
                                onChange={handleProductChange}
                                className="bamboo-select"
                            >
                                {products.map((product) => (
                                    <Option key={product.id} value={product.id}>
                                        {product.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Tooltip title="Reset all filters">
                                <Button
                                    onClick={resetFilters}
                                    icon={<FilterOutlined />}
                                    className="reset-filter-btn"
                                >
                                    Reset
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col xs={12} md={6} lg={3} style={{ textAlign: "right" }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                className="add-coupon-btn"
                            >
                                Add Coupon
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Display coupon count */}
            <div className="filter-results">
                <Text className="filter-count">
                    Showing {filteredCoupons.length} of {coupons.length} coupons
                </Text>
                {(searchTerm || selectedProduct) && (
                    <Text type="secondary">
                        Filters applied: {searchTerm ? "Search term, " : ""}
                        {selectedProduct ? "Product" : ""}
                    </Text>
                )}
            </div>

            {/* Coupons Table */}
            <Table
                columns={columns}
                dataSource={filteredCoupons}
                rowKey="id"
                pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                    pageSizeOptions: [5, 10, 15],
                    showTotal: (total) => `Total ${total} coupons`,
                }}
                scroll={{ x: 'max-content' }}
                rowClassName={(record) => {
                    const { status } = getCouponStatus(record.startDate, record.endDate);
                    return `bamboo-table-row ${status === 'expired' ? 'expired-row' : ''}`;
                }}
                className="bamboo-table"
            />

            {/* Add/Edit Modal */}
            <Modal
                open={isModalOpen}
                title={
                    <div className="modal-title">
                        {editingCoupon ? `Edit Coupon: ${editingCoupon.name}` : "Add New Coupon"}
                    </div>
                }
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                onOk={handleSubmit}
                okText={submitting ? "Saving..." : "Save"}
                confirmLoading={submitting}
                okButtonProps={{
                    disabled: submitting,
                    className: "save-btn"
                }}
                cancelButtonProps={{
                    className: "cancel-btn"
                }}
                width={700}
                className="bamboo-modal"
            >
                <Form form={form} layout="vertical" className="bamboo-form">
                    <Divider className="modal-divider" />

                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name="name"
                                label="Coupon Name"
                                rules={[{ required: true, message: "Please enter coupon name" }]}
                            >
                                <Input placeholder="Enter coupon name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="discountRate"
                                label="Discount Rate (%)"
                                rules={[{ required: true, message: "Please enter discount rate" }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={100}
                                    style={{ width: "100%" }}
                                    placeholder="0"
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value!.replace("%", "")}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name="code"
                                label="Coupon Code"
                                rules={[{ required: true, message: "Please enter coupon code" }]}
                            >
                                <Input
                                    placeholder="Enter coupon code"
                                    addonAfter={
                                        <Button
                                            type="link"
                                            onClick={generateCouponCode}
                                            className="generate-btn"
                                        >
                                            Generate
                                        </Button>
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="productId"
                        label="Apply to Product"
                        rules={[{ required: true, message: "Please select a product" }]}
                    >
                        <Select placeholder="Select a product">
                            {products.map((product) => (
                                <Select.Option key={product.id} value={product.id}>
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dateRange"
                        label="Validity Period"
                        rules={[{ required: true, message: "Please select start and end dates" }]}
                    >
                        <RangePicker
                            style={{ width: "100%" }}
                            format="YYYY-MM-DD"
                            disabledDate={(current) => current && current < dayjs().startOf("day")}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CouponsManage;