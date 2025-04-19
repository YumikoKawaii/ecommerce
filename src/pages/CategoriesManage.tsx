import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Spin, Modal, Form, Upload, message, Table, Space, Tooltip, Tag, Typography } from "antd";
import { PlusOutlined, UploadOutlined, LoadingOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { Category } from "../types/types.ts";
import { fetchCategories } from "../services/categoriesService.ts";
import "../css/AdminCategories.css";

const { Text } = Typography;

const CategoriesManage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(err => {
                console.error("Failed to fetch categories:", err);
                message.error("Failed to load categories");
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());
    };

    // Open modal for adding a new category
    const handleAdd = () => {
        setEditingCategory(null);
        setFileList([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Open modal for editing a category
    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        form.setFieldsValue({
            name: category.name,
            description: category.description || '',
        });

        // Set file list if there's an existing image
        if (category.imageUrl) {
            setFileList([
                {
                    uid: '-1',
                    name: 'current-image.png',
                    status: 'done',
                    url: category.imageUrl,
                },
            ]);
        } else {
            setFileList([]);
        }

        setIsModalOpen(true);
    };

    // Delete a category
    const handleDelete = (category: Category) => {
        // In a real app, you would make an API call here
        console.log(`Deleting category with ID: ${category.id}`);

        // Update local state by removing the deleted category
        setCategories(prev => prev.filter(c => c.id !== category.id));
        message.success(`Category "${category.name}" deleted`);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Check if we have an image
            if (fileList.length === 0) {
                message.error("Please upload an image");
                return;
            }

            setUploading(true);

            // In a real app, you would upload the file to a server here
            // For demo purposes, we'll simulate a file upload and get an image URL
            let imageUrl: string;

            if (fileList[0].originFileObj) {
                // This is a new file to upload
                // In a real app, this would be an API call
                await new Promise(resolve => setTimeout(resolve, 500)); // Fake upload delay
                imageUrl = URL.createObjectURL(fileList[0].originFileObj);
            } else {
                // This is an existing image from the database
                imageUrl = fileList[0].url || '';
            }

            // Create or update the category
            const categoryData = {
                ...values,
                imageUrl,
            };

            if (editingCategory) {
                // Update existing category
                const updatedCategory = {
                    ...editingCategory,
                    ...categoryData,
                };

                setCategories(prev =>
                    prev.map(c => c.id === editingCategory.id ? updatedCategory : c)
                );

                message.success(`Category "${updatedCategory.name}" updated`);
            } else {
                // Create new category
                const newCategory = {
                    ...categoryData,
                    id: Date.now(), // In a real app, the server would generate this
                };

                setCategories(prev => [...prev, newCategory]);
                message.success(`Category "${newCategory.name}" created`);
            }

            // Close modal and reset
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            setEditingCategory(null);
        } catch (error) {
            console.error("Form validation failed:", error);
        } finally {
            setUploading(false);
        }
    };

    // Handle file change - FIXED to properly handle file changes
    const handleFileChange = ({ fileList }) => {
        // Update the fileList directly with what the Upload component provides
        setFileList(fileList);

        // Check if the fileList is empty after a removal
        if (fileList.length === 0) {
            // Reset the file field completely to allow new uploads
            setUploading(false);
        } else if (fileList[0]?.originFileObj) {
            // If this is a new file, create a preview
            const file = fileList[0];
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

    // Handle upload props
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
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                message.error('Image must be smaller than 10MB!');
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
                onSuccess?.("ok");
            }, 0);
        },
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
            title: 'Category',
            key: 'category',
            width: 350,
            render: (record: Category) => (
                <div className="category-info-container">
                    <img
                        src={record.imageUrl}
                        alt={record.name}
                        className="category-image"
                    />
                    <div className="category-text-container">
                        <Tooltip title={record.name}>
                            <Text strong className="category-name" ellipsis>
                                {record.name}
                            </Text>
                        </Tooltip>
                        <Tooltip title={record.description || 'No description'}>
                            <Text type="secondary" className="category-description" ellipsis>
                                {record.description || 'No description'}
                            </Text>
                        </Tooltip>
                    </div>
                </div>
            ),
        },
        {
            title: 'Products',
            key: 'products',
            width: 120,
            align: 'center' as const,
            render: () => {
                // Placeholder for product count - in a real app, you would calculate this
                const count = Math.floor(Math.random() * 20); // Just for demo
                return (
                    <Tag className="products-count-tag">
                        {count} products
                    </Tag>
                );
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            align: 'left' as const,
            render: (description: string) => (
                <Text ellipsis={{ tooltip: description }}>
                    {description || 'No description available'}
                </Text>
            ),
            width: 300,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'center' as const,
            render: (_: unknown, record: Category) => {
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

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return <Spin tip="Loading..." className="loading-spinner" />;
    }

    return (
        <div className="categories-section">
            {/* Search and Add button row */}
            <Row className="search-add-container">
                <Col flex="auto">
                    <Input.Search
                        placeholder="Search categories"
                        allowClear
                        enterButton
                        onSearch={handleSearch}
                        className="category-search"
                    />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        className="add-category-btn"
                    >
                        Add Category
                    </Button>
                </Col>
            </Row>

            {/* Categories Table */}
            <Table
                columns={columns}
                dataSource={filteredCategories}
                rowKey="id"
                pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                    pageSizeOptions: [5, 10, 15],
                    showTotal: (total) => `Total ${total} categories`,
                }}
                scroll={{ x: 'max-content' }}
                rowClassName={() => 'bamboo-table-row'}
                className="bamboo-table"
            />

            {/* Add/Edit Modal */}
            <Modal
                open={isModalOpen}
                title={
                    <div className="modal-title">
                        {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add New Category"}
                    </div>
                }
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                    setFileList([]);
                }}
                onOk={handleSubmit}
                okText={uploading ? "Saving..." : "Save"}
                confirmLoading={uploading}
                okButtonProps={{
                    disabled: uploading,
                    className: "save-button"
                }}
                cancelButtonProps={{
                    className: "cancel-button"
                }}
                className="categories-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="categories-form"
                >
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please enter a category name' }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea rows={3} placeholder="Enter category description (optional)" />
                    </Form.Item>

                    <Form.Item
                        label="Image"
                        required
                        help="Supported formats: JPG, PNG. Max size: 10MB"
                    >
                        <Upload {...uploadProps}>
                            {fileList.length === 0 && (
                                <div>
                                    {uploading ? <LoadingOutlined /> : <UploadOutlined />}
                                    <div className="upload-container">Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoriesManage;