import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Row,
    Col,
    Breadcrumb,
    Image,
    Card,
    Divider,
    InputNumber,
    Tabs,
    Rate,
    Tag,
    Spin
} from 'antd';
import {
    ShoppingCartOutlined,
    HeartOutlined,
    ShareAltOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import FacingLayout from '../components/FacingLayout';
import { Product, Category } from '../types/types';
import { fetchProducts } from "../services/productsService";
import { fetchCategories } from "../services/categoriesService";
import '../css/ProductDetail.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('description');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const productsData = await fetchProducts();
                const categoriesData = await fetchCategories();

                // Find the current product
                const currentProduct = productsData.find(p => p.id === Number(productId));

                if (currentProduct) {
                    setProduct(currentProduct);

                    // Find related products (same category, excluding current product)
                    const related = productsData
                        .filter(p => p.categoryId === currentProduct.categoryId && p.id !== currentProduct.id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }

                setCategories(categoriesData);

                // Reset quantity to 1 when changing products
                setQuantity(1);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // Scroll to top when component mounts or product changes
        window.scrollTo(0, 0);
    }, [productId]);

    const handleQuantityChange = (value: number | null) => {
        setQuantity(value || 1);
    };

    const handleAddToCart = () => {
        // Add to cart functionality to be implemented
        console.log(`Added ${quantity} of product ID ${productId} to cart`);
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    if (loading) {
        return (
            <FacingLayout>
                <div className="product-detail-loading">
                    <Spin size="large" className="loading-spin" />
                </div>
            </FacingLayout>
        );
    }

    if (!product) {
        return (
            <FacingLayout>
                <div className="product-not-found">
                    <Title level={2}>Product Not Found</Title>
                    <Paragraph>
                        The product you're looking for doesn't exist or has been removed.
                    </Paragraph>
                    <Link to="/products">
                        <Button type="primary" size="large">
                            Browse All Products
                        </Button>
                    </Link>
                </div>
            </FacingLayout>
        );
    }

    const category = categories.find(c => c.id === product.categoryId);

    return (
        <FacingLayout>
            <div className="product-detail-container">
                {/* Breadcrumb navigation */}
                <Breadcrumb className="breadcrumb-nav">
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/products">Products</Link>
                    </Breadcrumb.Item>
                    {category && (
                        <Breadcrumb.Item>
                            <Link to={`/products/category/${category.id}`}>{category.name}</Link>
                        </Breadcrumb.Item>
                    )}
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                <Button
                    icon={<ArrowLeftOutlined />}
                    className="back-button"
                    onClick={() => window.history.back()}
                >
                    Back
                </Button>

                {/* Product Detail Section */}
                <Card className="product-card">
                    <Row gutter={[40, 20]}>
                        {/* Product Image */}
                        <Col xs={24} md={12}>
                            <div className="product-image-container">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="product-image"
                                    preview={{
                                        maskClassName: 'image-preview-mask',
                                    }}
                                />
                                {product.stock <= 5 && product.stock > 0 && (
                                    <div className="product-badge low-stock">
                                        Only {product.stock} left
                                    </div>
                                )}
                                {product.stock === 0 && (
                                    <div className="product-badge out-of-stock">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* Product Info */}
                        <Col xs={24} md={12}>
                            <div className="product-info">
                                <div className="product-category-tag">
                                    <Link to={`/products/category/${product.categoryId}`}>
                                        <Tag color="green">{category?.name || 'Uncategorized'}</Tag>
                                    </Link>
                                </div>

                                <Title level={2} className="product-title">
                                    {product.name}
                                </Title>

                                <div className="product-ratings">
                                    <Rate disabled defaultValue={4.5} allowHalf />
                                    <Text className="review-count">(12 reviews)</Text>
                                </div>

                                <div className="product-price">
                                    ${product.price.toFixed(2)}
                                </div>

                                <Paragraph className="product-short-description">
                                    {product.description}
                                </Paragraph>

                                <Divider className="product-divider" />

                                <div className="product-stock-status">
                                    <Text>
                                        Availability:
                                        {product.stock > 0 ? (
                                            <span className="in-stock"> In Stock ({product.stock} items)</span>
                                        ) : (
                                            <span className="out-of-stock"> Out of Stock</span>
                                        )}
                                    </Text>
                                </div>

                                <div className="product-actions">
                                    <div className="quantity-selector">
                                        <Text>Quantity:</Text>
                                        <InputNumber
                                            min={1}
                                            max={product.stock}
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            disabled={product.stock === 0}
                                            className="quantity-input"
                                        />
                                    </div>

                                    <div className="action-buttons">
                                        <Button
                                            type="primary"
                                            icon={<ShoppingCartOutlined />}
                                            size="large"
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                            className="add-to-cart-btn"
                                        >
                                            Add to Cart
                                        </Button>

                                        <Button
                                            icon={<HeartOutlined />}
                                            size="large"
                                            className="wishlist-btn"
                                        >
                                            Wishlist
                                        </Button>

                                        <Button
                                            icon={<ShareAltOutlined />}
                                            size="large"
                                            className="share-btn"
                                        >
                                            Share
                                        </Button>
                                    </div>
                                </div>

                                <Divider className="product-divider" />

                                <div className="product-benefits">
                                    <div className="benefit-item">
                                        <CheckCircleOutlined className="benefit-icon" />
                                        <Text>Free shipping on orders over $50</Text>
                                    </div>
                                    <div className="benefit-item">
                                        <CheckCircleOutlined className="benefit-icon" />
                                        <Text>30-day money-back guarantee</Text>
                                    </div>
                                    <div className="benefit-item">
                                        <CheckCircleOutlined className="benefit-icon" />
                                        <Text>Eco-friendly product</Text>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Product Description Tabs */}
                <div className="product-tabs">
                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        className="info-tabs"
                    >
                        <TabPane tab="Description" key="description">
                            <div className="tab-content">
                                <Title level={4}>Product Description</Title>
                                <Paragraph>
                                    {product.description}
                                </Paragraph>

                                <Title level={4} className="features-title">Key Features</Title>
                                <ul className="features-list">
                                    <li>Made from sustainable bamboo</li>
                                    <li>Eco-friendly and biodegradable</li>
                                    <li>Durable and long-lasting</li>
                                    <li>Natural aesthetic design</li>
                                    <li>Water-resistant finish</li>
                                </ul>
                            </div>
                        </TabPane>

                        <TabPane tab="Specifications" key="specifications">
                            <div className="tab-content">
                                <Title level={4}>Product Specifications</Title>
                                <table className="specs-table">
                                    <tbody>
                                    <tr>
                                        <td className="spec-name">Material</td>
                                        <td>Bamboo</td>
                                    </tr>
                                    <tr>
                                        <td className="spec-name">Dimensions</td>
                                        <td>Varies by product</td>
                                    </tr>
                                    <tr>
                                        <td className="spec-name">Weight</td>
                                        <td>Varies by product</td>
                                    </tr>
                                    <tr>
                                        <td className="spec-name">Color</td>
                                        <td>Natural Bamboo</td>
                                    </tr>
                                    <tr>
                                        <td className="spec-name">Origin</td>
                                        <td>Sustainably sourced</td>
                                    </tr>
                                    <tr>
                                        <td className="spec-name">Care Instructions</td>
                                        <td>Wipe with a damp cloth. Avoid prolonged exposure to water.</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPane>

                        <TabPane tab="Reviews (12)" key="reviews">
                            <div className="tab-content">
                                <Title level={4}>Customer Reviews</Title>
                                <Paragraph>
                                    Customer review content would go here.
                                </Paragraph>
                            </div>
                        </TabPane>

                        <TabPane tab="Shipping & Returns" key="shipping">
                            <div className="tab-content">
                                <Title level={4}>Shipping Information</Title>
                                <Paragraph>
                                    We offer free shipping on all orders over $50 within the continental United States.
                                    Shipping typically takes 3-5 business days.
                                </Paragraph>

                                <Title level={4}>Return Policy</Title>
                                <Paragraph>
                                    We accept returns within 30 days of purchase. Items must be in their original condition
                                    and packaging. Please contact our customer service team to initiate a return.
                                </Paragraph>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products-section">
                        <Title level={3} className="section-title">
                            Related Products
                        </Title>

                        <Row gutter={[24, 24]}>
                            {relatedProducts.map(relatedProduct => (
                                <Col xs={24} sm={12} md={8} lg={6} key={relatedProduct.id}>
                                    <Link to={`/products/${relatedProduct.id}`}>
                                        <Card
                                            hoverable
                                            className="related-product-card"
                                            cover={
                                                <div className="related-product-image-container">
                                                    <img
                                                        alt={relatedProduct.name}
                                                        src={relatedProduct.imageUrl}
                                                        className="related-product-image"
                                                    />
                                                    {relatedProduct.stock <= 5 && relatedProduct.stock > 0 && (
                                                        <div className="product-badge low-stock small">
                                                            Only {relatedProduct.stock} left
                                                        </div>
                                                    )}
                                                    {relatedProduct.stock === 0 && (
                                                        <div className="product-badge out-of-stock small">
                                                            Out of Stock
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <div className="related-product-category">
                                                {categories.find(c => c.id === relatedProduct.categoryId)?.name || 'Uncategorized'}
                                            </div>
                                            <Card.Meta
                                                title={<Text strong className="related-product-name">{relatedProduct.name}</Text>}
                                            />
                                            <div className="related-product-price">
                                                ${relatedProduct.price.toFixed(2)}
                                            </div>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </div>
        </FacingLayout>
    );
};

export default ProductDetail;