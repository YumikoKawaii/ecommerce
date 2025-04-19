import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Spin, Modal, Form, message, Table, Typography, Tag, Space, Tooltip } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined,
    ShopOutlined
} from "@ant-design/icons";
import { Supplier } from "../types/types.ts";
import { fetchSuppliers } from "../services/suppliersService.ts";

const { Text } = Typography;

const SuppliersManage = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const [form] = Form.useForm();

    useEffect(() => {
        fetchSuppliers()
            .then(setSuppliers)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());
    };

    const handleAdd = () => {
        setEditingSupplier(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        form.setFieldsValue(supplier);
        setIsModalVisible(true);
    };

    const handleDelete = (supplier: Supplier) => {
        console.log("Deleted: ", supplier.id);
        // Update local state by removing the deleted supplier
        setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
        message.success(`Supplier "${supplier.name}" deleted`);
    };

    const handleModalCancel = () => {
        form.resetFields();
        setEditingSupplier(null);
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values: Supplier) => {
        if (editingSupplier) {
            const updated = suppliers.map(s =>
                s.id === editingSupplier.id ? { ...s, ...values, id: editingSupplier.id } : s
            );
            setSuppliers(updated);
            message.success("Supplier updated successfully!");
        } else {
            const newSupplier: Supplier = {
                ...values,
                id: Date.now(), // In a real app, the server would generate this
            };
            setSuppliers(prev => [...prev, newSupplier]);
            message.success("Supplier added successfully!");
        }
        handleModalCancel();
    };

    // Table columns configuration
    const columns = [
        {
            title: 'Supplier',
            key: 'supplier',
            width: 280,
            render: (record: Supplier) => (
                <div className="supplier-info-container">
                    <div className="supplier-icon-container">
                        <ShopOutlined className="supplier-icon" />
                    </div>
                    <div>
                        <Text strong className="supplier-name">
                            {record.name}
                        </Text>
                        <Text type="secondary" className="supplier-id">
                            ID: {record.id}
                        </Text>
                    </div>
                </div>
            ),
            sorter: (a: Supplier, b: Supplier) => a.name.localeCompare(b.name),
        },
        {
            title: 'Contact Information',
            key: 'contact',
            width: 280,
            render: (record: Supplier) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <PhoneOutlined className="contact-icon" />
                        <Text>{record.phoneNumber || 'N/A'}</Text>
                    </Space>
                    <Space>
                        <MailOutlined className="contact-icon" />
                        <Text>{record.email || 'N/A'}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Address',
            key: 'address',
            width: 300,
            render: (record: Supplier) => (
                <Space>
                    <HomeOutlined className="contact-icon" />
                    <Text ellipsis={{ tooltip: record.address }}>
                        {record.address || 'No address provided'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 120,
            align: 'center' as const,
            render: (_: unknown) => (
                <Tag className="status-tag">
                    Active
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'center' as const,
            render: (_: unknown, record: Supplier) => {
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

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return <Spin tip="Loading..." className="loading-spinner" />;
    }

    return (
        <div className="suppliers-section">
            <Row justify="space-between" align="middle" className="header-container">
                <Col flex="auto">
                    <Input.Search
                        placeholder="Search Suppliers"
                        allowClear
                        enterButton
                        onSearch={handleSearch}
                        className="supplier-search"
                    />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        className="add-supplier-btn"
                    >
                        Add Supplier
                    </Button>
                </Col>
            </Row>

            {/* Suppliers Table */}
            <Table
                columns={columns}
                dataSource={filteredSuppliers}
                rowKey="id"
                pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                    pageSizeOptions: [5, 10, 15],
                    showTotal: (total) => `Total ${total} suppliers`,
                }}
                scroll={{ x: 'max-content' }}
                rowClassName={() => 'bamboo-table-row'}
                className="bamboo-table"
            />

            <Modal
                title={<div className="modal-title">{editingSupplier ? "Edit Supplier" : "Add Supplier"}</div>}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    className="supplier-form"
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the supplier name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Please input the phone number' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input the email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input the address' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="submit-button"
                        >
                            {editingSupplier ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SuppliersManage;