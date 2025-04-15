import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Spin, Modal, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Supplier } from "../types/types.ts";
import { fetchSuppliers } from "../services/suppliersService.ts";
import SuppliersTable from "../components/SuppliersTable.tsx";

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

    const handleModalCancel = () => {
        form.resetFields();
        setEditingSupplier(null);
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values: Supplier) => {
        if (editingSupplier) {
            const updated = suppliers.map(s =>
                s.id === values.id ? { ...s, ...values } : s
            );
            setSuppliers(updated);
            message.success("Supplier updated successfully!");
        } else {
            const newSupplier: Supplier = {
                ...values,
            };
            setSuppliers(prev => [...prev, newSupplier]);
            message.success("Supplier added successfully!");
        }
        handleModalCancel();
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return <Spin tip="Loading..." style={{ display: 'block', margin: '80px auto' }} />;
    }

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col flex="auto">
                    <Input.Search
                        placeholder="Search Suppliers"
                        allowClear
                        enterButton
                        onSearch={handleSearch}
                        style={{ maxWidth: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add Supplier
                    </Button>
                </Col>
            </Row>

            <SuppliersTable suppliers={filteredSuppliers} onEdit={handleEdit} />

            <Modal
                title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    // initialValues={{ id: 0 }}
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
                        <Button type="primary" htmlType="submit" block>
                            {editingSupplier ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default SuppliersManage;
