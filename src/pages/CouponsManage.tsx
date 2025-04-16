import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Spin, Modal, Form, Select, InputNumber, DatePicker, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Coupon, Product } from "../types/types.ts";
import { fetchCoupons } from "../services/couponsService.ts";
import CouponsTable from "../components/CouponsTable.tsx";
import { fetchProducts } from "../services/productsService.ts";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const CouponsManage = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
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

    // Generate a random coupon code
    const generateCouponCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        form.setFieldsValue({ code: result });
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

    // Filter coupons based on search term
    const filteredCoupons = coupons.filter(coupon =>
        coupon.name.toLowerCase().includes(searchTerm) ||
        coupon.code.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return <Spin tip="Loading..." style={{ display: 'block', margin: '80px auto' }} />;
    }

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col flex="auto">
                    <Input.Search
                        placeholder="Search Coupons"
                        allowClear
                        enterButton
                        onSearch={handleSearch}
                        style={{ maxWidth: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add Coupon
                    </Button>
                </Col>
            </Row>

            <CouponsTable
                coupons={filteredCoupons}
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Add/Edit Modal */}
            <Modal
                open={isModalOpen}
                title={editingCoupon ? `Edit Coupon: ${editingCoupon.name}` : "Add New Coupon"}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                onOk={handleSubmit}
                okText={submitting ? "Saving..." : "Save"}
                confirmLoading={submitting}
                okButtonProps={{ disabled: submitting }}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
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
                                            style={{ padding: 0 }}
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