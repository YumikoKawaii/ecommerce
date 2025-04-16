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
    Select,
    InputNumber,
    Typography,
    Card,
    Divider,
    Tooltip,
    Badge
} from "antd";
import {
    PlusOutlined,
    UploadOutlined,
    LoadingOutlined,
    SearchOutlined,
    FilterOutlined,
    TagOutlined,
    DollarOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { Product, Category, Supplier } from "../types/types.ts";
import { fetchProducts } from "../services/productsService.ts";
import ProductsTable from "../components/ProductsTable.tsx";
import { fetchSuppliers } from "../services/suppliersService.ts";
import { fetchCategories } from "../services/categoriesService.ts";

const { Title, Text } = Typography;
const { Option } = Select;

const ProductsManage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
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
    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());
    };

    // Handle category filter
    const handleCategoryChange = (value: number | null) => {
        setSelectedCategory(value);
    };

    // Handle supplier filter
    const handleSupplierChange = (value: number | null) => {
        setSelectedSupplier(value);
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory(null);
        setSelectedSupplier(null);
    };

    // Open modal for adding a new product
    const handleAdd = () => {
        setEditingProduct(null);
        setFileList([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Open modal for editing a product
    const handleEdit = (product: Product) => {
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
    const handleDelete = (product: Product) => {
        // In a real app, you would make an API call here
        console.log(`Deleting product with ID: ${product.id}`);

        // Update local state by removing the deleted product
        setProducts(prev => prev.filter(p => p.id !== product.id));
        message.success(`Product "${product.name}" deleted`);
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
                };

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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Spin
                    tip="Loading products..."
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
                <Title level={4} style={{ color: '#558B2F', marginBottom: 16 }}>Products Management</Title>

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
                                    <Text type="secondary">Total Products</Text>
                                    <Title level={3} style={{ margin: '8px 0', color: '#558B2F' }}>{totalProducts}</Title>
                                </div>
                                <ShoppingOutlined style={{ fontSize: 30, color: '#8BC34A' }} />
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
                                    <Text type="secondary">Total Inventory</Text>
                                    <Title level={3} style={{ margin: '8px 0', color: '#558B2F' }}>{totalStock} units</Title>
                                </div>
                                <TagOutlined style={{ fontSize: 30, color: '#8BC34A' }} />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card
                            style={{
                                background: lowStockCount > 0 ?
                                    'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)' :
                                    'linear-gradient(135deg, #F1F8E5 0%, #DCE8BB 100%)',
                                borderRadius: 8,
                                border: lowStockCount > 0 ? '1px solid #FFECB3' : '1px solid #DCE8BB'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Low Stock Items</Text>
                                    <Title level={3} style={{
                                        margin: '8px 0',
                                        color: lowStockCount > 0 ? '#FF8F00' : '#558B2F'
                                    }}>
                                        {lowStockCount}
                                    </Title>
                                </div>
                                <Badge count={lowStockCount} color={lowStockCount > 0 ? '#FF8F00' : '#8BC34A'}>
                                    <DollarOutlined style={{ fontSize: 30, color: lowStockCount > 0 ? '#FF8F00' : '#8BC34A' }} />
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
                                Add Product
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Display product count */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#558B2F' }}>
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

            <ProductsTable
                products={filteredProducts}
                categories={categories}
                suppliers={suppliers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Add/Edit Modal */}
            <Modal
                open={isModalOpen}
                title={
                    <div style={{ color: '#558B2F' }}>
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
                            style={{ borderColor: '#E8EECC' }}
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