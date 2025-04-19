import {JSX, useEffect, useState} from "react";
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
    Select,
    InputNumber,
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
    UploadOutlined,
    LoadingOutlined,
    SearchOutlined,
    FilterOutlined,
    TagOutlined,
    DollarOutlined,
    ShoppingOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";
import { Product, Category, Supplier } from "../types/types";
import { fetchProducts } from "../services/productsService";
import { fetchSuppliers } from "../services/suppliersService";
import { fetchCategories } from "../services/categoriesService";
import '../css/AdminProducts.css';

const { Title, Text } = Typography;
const { Option } = Select;

const ProductsManage = (): JSX.Element => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [form] = Form.useForm();

    // Fetch data on mount
    useEffect(() => {
        Promise.all([
            fetchProducts().then(setProducts),
            fetchSuppliers().then(setSuppliers),
            fetchCategories().then(setCategories)
        ])
            .catch(err => {
                console.error("Failed to fetch data:", err);
                message.error("Failed to load data");
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle search
    const handleSearch = (value: string): void => {
        setSearchTerm(value.toLowerCase());
    };

    // Handle category filter
    const handleCategoryChange = (value: number | null): void => {
        setSelectedCategory(value);
    };

    // Handle supplier filter
    const handleSupplierChange = (value: number | null): void => {
        setSelectedSupplier(value);
    };

    // Reset all filters
    const resetFilters = (): void => {
        setSearchTerm("");
        setSelectedCategory(null);
        setSelectedSupplier(null);
    };

    // Open modal for adding a new product
    const handleAdd = (): void => {
        setEditingProduct(null);
        setFileList([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Open modal for editing a product
    const handleEdit = (product: Product): void => {
        setEditingProduct(product);
        form.setFieldsValue({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            supplierId: product.supplierId,
        });

        // Set file list if there's an existing image
        if (product.imageUrl) {
            setFileList([
                {
                    uid: '-1',
                    name: 'current-image.png',
                    status: 'done',
                    url: product.imageUrl,
                },
            ]);
        } else {
            setFileList([]);
        }

        setIsModalOpen(true);
    };

    // Delete a product
    const handleDelete = (product: Product): void => {
        // In a real app, you would make an API call here
        console.log(`Deleting product with ID: ${product.id}`);

        // Update local state by removing the deleted product
        setProducts(prev => prev.filter(p => p.id !== product.id));
        message.success(`Product "${product.name}" deleted`);
    };

    // Handle form submission
    const handleSubmit = async (): Promise<void> => {
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
            let imageUrl = '';

            if (fileList[0].originFileObj) {
                // This is a new file to upload
                // In a real app, this would be an API call
                await new Promise(resolve => setTimeout(resolve, 500)); // Fake upload delay
                imageUrl = URL.createObjectURL(fileList[0].originFileObj);
            } else {
                // This is an existing image from the database
                imageUrl = fileList[0].url || '';
            }

            // Create or update the product
            const productData = {
                ...values,
                imageUrl,
            };

            if (editingProduct) {
                // Update existing product
                const updatedProduct = {
                    ...editingProduct,
                    ...productData,
                };

                setProducts(prev =>
                    prev.map(p => p.id === editingProduct.id ? updatedProduct : p)
                );

                message.success(`Product "${updatedProduct.name}" updated`);
            } else {
                // Create new product
                const newProduct = {
                    ...productData,
                    id: Date.now().toString(), // In a real app, the server would generate this
                } as Product;

                setProducts(prev => [...prev, newProduct]);
                message.success(`Product "${newProduct.name}" created`);
            }

            // Close modal and reset
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            setEditingProduct(null);
        } catch (error) {
            console.error("Form validation failed:", error);
        } finally {
            setUploading(false);
        }
    };

    // Handle file change
    const handleFileChange = (info: UploadChangeParam): void => {
        // Update the fileList directly with what the Upload component provides
        setFileList(info.fileList);

        // Check if the fileList is empty after a removal
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
                onSuccess?.("ok", undefined as never);
            }, 0);
        },
    };

    // Get color based on stock level
    const getStockStatusColor = (stock: number): string => {
        if (stock <= 5) return '#ff4d4f'; // Red for low stock
        if (stock <= 20) return '#faad14'; // Yellow for medium stock
        return '#52c41a'; // Green for good stock
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
            title: 'Product',
            key: 'product',
            width: 350,
            render: (_: string, record: Product) => (
                <div className="product-info-container">
                    <img
                        src={record.imageUrl}
                        alt={record.name}
                        className="product-image"
                    />
                    <div className="product-info">
                        <Text strong className="product-name" ellipsis>{record.name}</Text>
                        <Text type="secondary" ellipsis={{ rows: 2 }} className="product-description">
                            {record.description || 'No description available'}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            align: 'center' as const,
            render: (price: number) => (
                <Text strong className="product-price">
                    ${price.toFixed(2)}
                </Text>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'categoryId',
            key: 'categoryId',
            width: 150,
            align: 'center' as const,
            render: (categoryId: number) => {
                const category = categories.find((cat) => cat.id === categoryId);
                return category ? (
                    <Tag className="category-tag">
                        {category.name}
                    </Tag>
                ) : '';
            },
            filters: categories.map(cat => ({ text: cat.name, value: cat.id })),
            onFilter: (value: number, record: Product) => record.categoryId === value,
        },
        {
            title: 'Supplier',
            dataIndex: 'supplierId',
            key: 'supplierId',
            width: 150,
            align: 'center' as const,
            render: (supplierId: number) => {
                const supplier = suppliers.find((supp) => supp.id === supplierId);
                return supplier ? (
                    <Tag className="supplier-tag">
                        {supplier.name}
                    </Tag>
                ) : '';
            },
            filters: suppliers.map(sup => ({ text: sup.name, value: sup.id })),
            onFilter: (value: number, record: Product) => record.supplierId === value,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            width: 120,
            align: 'center' as const,
            render: (stock: number) => (
                <Space>
                    <Badge
                        color={getStockStatusColor(stock)}
                        text={
                            <Text strong className="stock-value" style={{ color: getStockStatusColor(stock) }}>
                                {stock}
                            </Text>
                        }
                    />
                </Space>
            ),
            sorter: (a: Product, b: Product) => a.stock - b.stock,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'center' as const,
            render: (_: unknown, record: Product) => {
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

    // Filter products based on search term and selected filters
    const filteredProducts = products.filter(product => {
        // Filter by search term
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);

        // Filter by category if selected
        const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;

        // Filter by supplier if selected
        const matchesSupplier = selectedSupplier ? product.supplierId === selectedSupplier : true;

        return matchesSearch && matchesCategory && matchesSupplier;
    });

    // Calculate stats
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const lowStockCount = products.filter(product => product.stock <= 5).length;

    if (loading) {
        return (
            <div className="loading-container">
                <Spin
                    tip="Loading products..."
                    size="large"
                    className="loading-spin"
                    indicator={<LoadingOutlined className="loading-icon" spin />}
                />
            </div>
        );
    }

    return (
        <>
            <div className="stats-section">
                <Title level={4} className="page-title">Products Management</Title>

                {/* Stats Cards */}
                <Row gutter={16} className="stats-row">
                    <Col xs={24} sm={8}>
                        <Card className="stats-card stats-card-default">
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Total Products</Text>
                                    <Title level={3} className="stats-value">{totalProducts}</Title>
                                </div>
                                <ShoppingOutlined className="stats-icon" />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="stats-card stats-card-green">
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Total Inventory</Text>
                                    <Title level={3} className="stats-value">{totalStock} units</Title>
                                </div>
                                <TagOutlined className="stats-icon" />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className={`stats-card ${lowStockCount > 0 ? 'stats-card-warning' : 'stats-card-green'}`}>
                            <div className="stats-content">
                                <div>
                                    <Text type="secondary">Low Stock Items</Text>
                                    <Title level={3} className={lowStockCount > 0 ? "stats-value-warning" : "stats-value"}>
                                        {lowStockCount}
                                    </Title>
                                </div>
                                <Badge count={lowStockCount} color={lowStockCount > 0 ? '#FF8F00' : '#8BC34A'}>
                                    <DollarOutlined className={lowStockCount > 0 ? "stats-icon-warning" : "stats-icon"} />
                                </Badge>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card className="filters-card">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={12} lg={8}>
                            <Input.Search
                                placeholder="Search products by name"
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
                            <Row gutter={8}>
                                <Col span={12}>
                                    <Select
                                        placeholder="Filter by Category"
                                        style={{ width: '100%' }}
                                        allowClear
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        className="bamboo-select"
                                    >
                                        {categories.map(category => (
                                            <Option key={category.id} value={category.id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={12}>
                                    <Select
                                        placeholder="Filter by Supplier"
                                        style={{ width: '100%' }}
                                        allowClear
                                        value={selectedSupplier}
                                        onChange={handleSupplierChange}
                                        className="bamboo-select"
                                    >
                                        {suppliers.map(supplier => (
                                            <Option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>
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

                        <Col xs={12} md={6} lg={3} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                className="add-product-btn"
                            >
                                Add Product
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Display product count */}
            <div className="filter-results">
                <Text className="filter-count">
                    Showing {filteredProducts.length} of {products.length} products
                </Text>
                {(searchTerm || selectedCategory || selectedSupplier) && (
                    <Text type="secondary">
                        Filters applied: {searchTerm ? 'Search term, ' : ''}
                        {selectedCategory ? 'Category, ' : ''}
                        {selectedSupplier ? 'Supplier' : ''}
                    </Text>
                )}
            </div>

            {/* Products Table */}
            <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="id"
                pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                    pageSizeOptions: ['5', '10', '15'],
                    showTotal: (total) => `Total ${total} products`,
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
                        {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}
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
                    className: "save-btn"
                }}
                cancelButtonProps={{
                    className: "cancel-btn"
                }}
                width={700}
                className="bamboo-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="bamboo-form"
                >
                    <Divider className="modal-divider" />

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Product Name"
                                rules={[{ required: true, message: 'Please enter product name' }]}
                            >
                                <Input placeholder="Enter product name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[{ required: true, message: 'Please enter price' }]}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                    placeholder="0.00"
                                    formatter={value => `$ ${value}`}
                                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="categoryId"
                                label="Category"
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select placeholder="Select a category">
                                    {categories.map(category => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="supplierId"
                                label="Supplier"
                                rules={[{ required: true, message: 'Please select a supplier' }]}
                            >
                                <Select placeholder="Select a supplier">
                                    {suppliers.map(supplier => (
                                        <Select.Option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="stock"
                                label="Stock Quantity"
                                rules={[{ required: true, message: 'Please enter stock quantity' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter product description (optional)"
                        />
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
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ProductsManage;