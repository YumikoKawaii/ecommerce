import { useEffect, useState } from "react";
import {
    Input,
    Button,
    Row,
    Col,
    Spin,
    Modal,
    Form,
    Upload,
    message,
    Table,
    Space,
    Tooltip,
    Tag,
    Typography,
    Card,
    Divider,
    Badge,
} from "antd";
import {
    PlusOutlined,
    UploadOutlined,
    LoadingOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    FilterOutlined,
    AppstoreOutlined,
    TagsOutlined
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { Category } from "../types/types.ts";
import { fetchCategories } from "../services/categoriesService.ts";
import "../css/AdminCategories.css";

const { Text, Title } = Typography;

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

    // Reset search
    const resetSearch = () => {
        setSearchTerm("");
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

    // Generate random product count for demo purposes
    const getRandomProductCount = (categoryId: number) => {
        // Use a deterministic random generator based on the ID
        // to ensure the same category always shows the same count
        const seed = categoryId % 30;
        return seed + Math.floor(seed / 3);
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
                        <Text strong className="category-name" ellipsis>
                            {record.name}
                        </Text>
                        <Text type="secondary" className="category-description" ellipsis={{ rows: 2 }}>
                            {record.description || 'No description'}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Products',
            key: 'products',
            width: 120,
            align: 'center' as const,
            sorter: (a: Category, b: Category) => getRandomProductCount(a.id) - getRandomProductCount(b.id),
            render: (record: Category) => {
                // Get a consistent count for each category
                const count = getRandomProductCount(record.id);
                const status = count < 5 ? 'low' : count < 15 ? 'medium' : 'high';

                return (
                    <Tag
                        className={`products-count-tag products-count-${status}`}
                    >
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
        category.name.toLowerCase().includes(searchTerm) ||
        (category.description && category.description.toLowerCase().includes(searchTerm))
    );

    // Calculate stats
    const totalCategories = categories.length;
    const totalProducts = categories.reduce((sum, category) => sum + getRandomProductCount(category.id), 0);
    const lowStockCategories = categories.filter(category => getRandomProductCount(category.id) < 5).length;

    if (loading) {
        return (
            <div className="loading-container">
                <Spin
                    tip="Loading categories..."
                    size="large"
                    className="loading-spinner"
                    indicator={<LoadingOutlined className="loading-icon" spin />}
                />
            </div>
        );
    }

    return (
        <div className="categories-section">
            <div className="categories-header">
                <Title level={4} className="page-title">Categories Management</Title>

                {/* Stats Cards */}
                <Row gutter={16} className="stats-row">
                    <Col xs={24} sm={8}>
                        <Card className="stats-card stats-card-default">
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Total Categories</Text>
                                    <Title level={3} className="stats-value">{totalCategories}</Title>
                                </div>
                                <AppstoreOutlined className="stats-icon" />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="stats-card stats-card-green">
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Total Products</Text>
                                    <Title level={3} className="stats-value">{totalProducts} items</Title>
                                </div>
                                <TagsOutlined className="stats-icon" />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className={`stats-card ${lowStockCategories > 0 ? 'stats-card-warning' : 'stats-card-green'}`}>
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Low Stock Categories</Text>
                                    <Title level={3} className={lowStockCategories > 0 ? "stats-value-warning" : "stats-value"}>
                                        {lowStockCategories}
                                    </Title>
                                </div>
                                <Badge count={lowStockCategories} color={lowStockCategories > 0 ? '#FF8F00' : '#8BC34A'}>
                                    <FilterOutlined className={lowStockCategories > 0 ? "stats-icon-warning" : "stats-icon"} />
                                </Badge>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Search and Add button row */}
            <Card className="filters-card">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={18} lg={16}>
                        <Input.Search
                            placeholder="Search by category name or description"
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="category-search"
                        />
                    </Col>

                    <Col xs={12} md={3} lg={4}>
                        <Tooltip title="Reset search">
                            <Button
                                onClick={resetSearch}
                                icon={<FilterOutlined />}
                                className="reset-filter-btn"
                                disabled={!searchTerm}
                            >
                                Reset
                            </Button>
                        </Tooltip>
                    </Col>

                    <Col xs={12} md={3} lg={4} style={{ textAlign: 'right' }}>
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
            </Card>

            {/* Display category count */}
            <div className="filter-results">
                <Text className="filter-count">
                    Showing {filteredCategories.length} of {categories.length} categories
                </Text>
                {searchTerm && (
                    <Text type="secondary">
                        Search term: "{searchTerm}"
                    </Text>
                )}
            </div>

            {/* Categories Table */}
            <Table
                columns={columns}
                dataSource={filteredCategories}
                rowKey="id"
                pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                    pageSizeOptions: ['5', '10', '15'],
                    showTotal: (total) => `Total ${total} categories`,
                }}
                scroll={{ x: 'max-content' }}
                rowClassName={() => 'bamboo-table-row'}
                className="bamboo-table"
                locale={{ emptyText: 'No categories found' }}
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
                width={600}
            >
                <Divider className="modal-divider" />

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