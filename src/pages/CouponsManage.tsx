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
    Badge
} from "antd";
import {
    PlusOutlined,
    LoadingOutlined,
    SearchOutlined,
    FilterOutlined,
    TagOutlined,
    DollarOutlined,
    GiftOutlined
} from "@ant-design/icons";
import { Coupon, Product } from "../types/types.ts";
import { fetchCoupons } from "../services/couponsService.ts";
import CouponsTable from "../components/CouponsTable.tsx";
import { fetchProducts } from "../services/productsService.ts";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

const CouponsManage = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    // Fetch data on mount
    useEffect(() => {
        Promise.all([
            fetchCoupons().then(setCoupons),
            fetchProducts().then(setProducts)
        ])
            .catch(err => {
                console.error("Failed to fetch data:", err);
                message.error("Failed to load data");
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());
    };

    // Handle product filter
    const handleProductChange = (value: string | null) => {
        setSelectedProduct(value);
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setSelectedProduct(null);
    };

    // Generate a random coupon code
    const generateCouponCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        form.setFieldsValue({ code: result });
    };

    // Open modal for adding a new coupon
    const handleAdd = () => {
        setEditingCoupon(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Open modal for editing a coupon
    const handleEdit = (coupon: Coupon) => {
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
    const handleDelete = (coupon: Coupon) => {
        // In a real app, you would make an API call here
        console.log(`Deleting coupon with ID: ${coupon.id}`);

        // Update local state by removing the deleted coupon
        setCoupons(prev => prev.filter(c => c.id !== coupon.id));
        message.success(`Coupon "${coupon.name}" deleted`);
    };

    // Handle form submission
    const handleSubmit = async () => {
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
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            };

            if (editingCoupon) {
                // Update existing coupon
                const updatedCoupon = {
                    ...editingCoupon,
                    ...couponData,
                };

                setCoupons(prev =>
                    prev.map(c => c.id === editingCoupon.id ? updatedCoupon : c)
                );

                message.success(`Coupon "${updatedCoupon.name}" updated`);
            } else {
                // Create new coupon
                const newCoupon = {
                    ...couponData,
                    id: Date.now(), // In a real app, the server would generate this
                };

                setCoupons(prev => [...prev, newCoupon]);
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

    // Filter coupons based on search term and selected filters
    const filteredCoupons = coupons.filter(coupon => {
        // Filter by search term
        const matchesSearch = coupon.name.toLowerCase().includes(searchTerm) ||
            coupon.code.toLowerCase().includes(searchTerm);

        // Filter by product if selected
        const matchesProduct = selectedProduct ? coupon.productId.toString() === selectedProduct : true;

        return matchesSearch && matchesProduct;
    });

    // Calculate stats
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(coupon => {
        const currentDate = dayjs().format('YYYY-MM-DD');
        return currentDate >= coupon.startDate && currentDate <= coupon.endDate;
    }).length;
    const expiringCoupons = coupons.filter(coupon => {
        const currentDate = dayjs();
        const endDate = dayjs(coupon.endDate);
        const daysRemaining = endDate.diff(currentDate, 'day');
        return daysRemaining >= 0 && daysRemaining <= 7;
    }).length;

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Spin
                    tip="Loading coupons..."
                    size="large"
                    style={{ color: '#558B2F' }}
                    indicator={<LoadingOutlined style={{ fontSize: 24, color: '#8BC34A' }} spin />}
                />
            </div>
        );
    }

    return (
        <>
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ color: '#558B2F', marginBottom: 16 }}>Coupons Management</Title>

                {/* Stats Cards */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card
                            style={{
                                background: 'linear-gradient(135deg, #F8F9E8 0%, #E8EECC 100%)',
                                borderRadius: 8,
                                border: '1px solid #E8EECC'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Total Coupons</Text>
                                    <Title level={3} style={{ margin: '8px 0', color: '#558B2F' }}>{totalCoupons}</Title>
                                </div>
                                <TagOutlined style={{ fontSize: 30, color: '#8BC34A' }} />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card
                            style={{
                                background: 'linear-gradient(135deg, #F1F8E5 0%, #DCE8BB 100%)',
                                borderRadius: 8,
                                border: '1px solid #DCE8BB'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Active Coupons</Text>
                                    <Title level={3} style={{ margin: '8px 0', color: '#558B2F' }}>{activeCoupons}</Title>
                                </div>
                                <GiftOutlined style={{ fontSize: 30, color: '#8BC34A' }} />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card
                            style={{
                                background: expiringCoupons > 0 ?
                                    'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)' :
                                    'linear-gradient(135deg, #F1F8E5 0%, #DCE8BB 100%)',
                                borderRadius: 8,
                                border: expiringCoupons > 0 ? '1px solid #FFECB3' : '1px solid #DCE8BB'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Expiring Soon</Text>
                                    <Title level={3} style={{
                                        margin: '8px 0',
                                        color: expiringCoupons > 0 ? '#FF8F00' : '#558B2F'
                                    }}>
                                        {expiringCoupons}
                                    </Title>
                                </div>
                                <Badge count={expiringCoupons} color={expiringCoupons > 0 ? '#FF8F00' : '#8BC34A'}>
                                    <DollarOutlined style={{ fontSize: 30, color: expiringCoupons > 0 ? '#FF8F00' : '#8BC34A' }} />
                                </Badge>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card
                    style={{
                        borderRadius: 8,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #E8EECC'
                    }}
                >
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={12} lg={8}>
                            <Input.Search
                                placeholder="Search coupons by name or code"
                                allowClear
                                enterButton={<SearchOutlined />}
                                onSearch={handleSearch}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%' }}
                                className="bamboo-search"
                            />
                        </Col>

                        <Col xs={24} md={12} lg={10}>
                            <Select
                                placeholder="Filter by Product"
                                style={{ width: '100%' }}
                                allowClear
                                value={selectedProduct}
                                onChange={handleProductChange}
                                className="bamboo-select"
                            >
                                {products.map(product => (
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
                                    style={{
                                        marginRight: 8,
                                        borderColor: '#B7CA79',
                                        color: '#558B2F',
                                    }}
                                >
                                    Reset
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col xs={12} md={6} lg={3} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                style={{
                                    background: 'linear-gradient(135deg, #8BC34A 0%, #558B2F 100%)',
                                    border: 'none',
                                    boxShadow: '0 2px 6px rgba(139, 195, 74, 0.4)'
                                }}
                            >
                                Add Coupon
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Display coupon count */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#558B2F' }}>
                    Showing {filteredCoupons.length} of {coupons.length} coupons
                </Text>
                {(searchTerm || selectedProduct) && (
                    <Text type="secondary">
                        Filters applied: {searchTerm ? 'Search term, ' : ''}
                        {selectedProduct ? 'Product' : ''}
                    </Text>
                )}
            </div>

            <CouponsTable
                coupons={filteredCoupons}
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Add/Edit Modal */}
            <Modal
                open={isModalOpen}
                title={
                    <div style={{ color: '#558B2F' }}>
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
                    style: {
                        backgroundColor: '#75A742',
                        borderColor: '#75A742'
                    }
                }}
                cancelButtonProps={{
                    style: { borderColor: '#DCE8BB', color: '#558B2F' }
                }}
                width={700}
                className="bamboo-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="bamboo-form"
                >
                    <Divider style={{ margin: '0 0 24px 0', borderColor: '#E8EECC' }} />

                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name="name"
                                label="Coupon Name"
                                rules={[{ required: true, message: 'Please enter coupon name' }]}
                            >
                                <Input placeholder="Enter coupon name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="discountRate"
                                label="Discount Rate (%)"
                                rules={[{ required: true, message: 'Please enter discount rate' }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={100}
                                    style={{ width: '100%' }}
                                    placeholder="0"
                                    formatter={value => `${value}%`}
                                    parser={value => value!.replace('%', '')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name="code"
                                label="Coupon Code"
                                rules={[{ required: true, message: 'Please enter coupon code' }]}
                            >
                                <Input
                                    placeholder="Enter coupon code"
                                    addonAfter={
                                        <Button
                                            type="link"
                                            onClick={generateCouponCode}
                                            style={{ padding: 0, color: '#558B2F' }}
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
                        rules={[{ required: true, message: 'Please select a product' }]}
                    >
                        <Select placeholder="Select a product">
                            {products.map(product => (
                                <Select.Option key={product.id} value={product.id}>
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dateRange"
                        label="Validity Period"
                        rules={[{ required: true, message: 'Please select start and end dates' }]}
                    >
                        <RangePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            disabledDate={current => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CouponsManage;