import { useEffect, useState } from 'react';
import { Typography, Button, Row, Col, Card, Carousel, Spin, Empty } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined, ShoppingOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import FacingLayout from '../components/FacingLayout';
import {Product, Category} from '../types/types';
import {fetchProducts} from "../services/productsService.ts";
import {fetchCategories} from "../services/categoriesService.ts";
import '../css/Landing.css';

const { Title, Paragraph, Text } = Typography;

const Landing = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Carousel images - replace with your actual images
    const carouselImages = [
        {
            url: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1745053362/Flux_Dev_Animestyle_image_of_a_bright_minimalist_room_showcasi_1_g9jmvl.jpg',
            title: 'Sustainable Bamboo Collection',
            subtitle: 'Eco-friendly products for your home'
        },
        {
            url: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1745054102/Flux_Dev_Animestyle_interior_focusing_on_rattan_furniture_a_de_1_pwcyff.jpg',
            title: 'Elegant Rattan Furniture',
            subtitle: 'Handcrafted for comfort and style'
        },
        {
            url: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1745054102/Flux_Dev_Animestyle_kitchen_countertop_scene_showcasing_bamboo_1_cicq86.jpg',
            title: 'Kitchen Essentials',
            subtitle: 'Practical and beautiful bamboo kitchenware'
        },
        {
            url: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1745054103/Flux_Dev_Animestyle_patio_scene_dedicated_to_outdoor_bamboo_an_1_qnutpu.jpg',
            title: 'Outdoor Living',
            subtitle: 'Durable bamboo for your garden and patio'
        }
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Use the external functions to fetch data
                const productsData = await fetchProducts();
                const categoriesData = await fetchCategories();

                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Custom carousel arrows
    const NextArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} carousel-arrow carousel-arrow-next`}
                style={{ ...style }}
                onClick={onClick}
            >
                <RightOutlined />
            </div>
        );
    };

    const PrevArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} carousel-arrow carousel-arrow-prev`}
                style={{ ...style }}
                onClick={onClick}
            >
                <LeftOutlined />
            </div>
        );
    };

    return (
        <FacingLayout>
            {/* Hero Carousel Section */}
            <div className="carousel-container">
                <Carousel
                    autoplay
                    autoplaySpeed={5000}
                    effect="fade"
                    arrows
                    nextArrow={<NextArrow />}
                    prevArrow={<PrevArrow />}
                >
                    {carouselImages.map((image, index) => (
                        <div key={index}>
                            <div
                                className="carousel-slide"
                                style={{
                                    backgroundImage: `url(${image.url})`,
                                }}
                            >
                                {/* Minimal text overlay with improved contrast */}
                                <div className="carousel-content">
                                    <Title level={1} className="carousel-title">
                                        {image.title}
                                    </Title>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
                {/* Shop Now button moved outside carousel */}
                <div className="carousel-action-container">
                    <Button
                        type="primary"
                        size="large"
                        className="carousel-button"
                    >
                        Shop Now <ArrowRightOutlined />
                    </Button>
                </div>
            </div>

            {/* Categories Slider Section */}
            <div className="section category-section">
                <Title level={2} className="section-title">
                    Browse by Category
                </Title>

                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : categories.length === 0 ? (
                    <Empty description="No categories found" />
                ) : (
                    <div className="category-slider-container">
                        <Carousel
                            slidesToShow={Math.min(4, categories.length)}
                            slidesToScroll={1}
                            autoplay
                            autoplaySpeed={2000}
                            responsive={[
                                {
                                    breakpoint: 1024,
                                    settings: {
                                        slidesToShow: Math.min(3, categories.length),
                                        slidesToScroll: 1,
                                    },
                                },
                                {
                                    breakpoint: 768,
                                    settings: {
                                        slidesToShow: Math.min(2, categories.length),
                                        slidesToScroll: 1,
                                    },
                                },
                                {
                                    breakpoint: 480,
                                    settings: {
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                    },
                                },
                            ]}
                            arrows
                            nextArrow={<NextArrow />}
                            prevArrow={<PrevArrow />}
                        >
                            {categories.map((category) => (
                                <div key={category.id} className="category-slide">
                                    <Card
                                        hoverable
                                        className="category-card"
                                        cover={
                                            <div className="category-image-container">
                                                <img
                                                    alt={category.name}
                                                    src={category.imageUrl}
                                                    className="category-image"
                                                />
                                            </div>
                                        }
                                    >
                                        <Card.Meta
                                            title={<Text strong className="category-name">{category.name}</Text>}
                                            description={<Text className="category-description">{category.description}</Text>}
                                        />
                                        <Button
                                            type="link"
                                            className="category-button"
                                        >
                                            View Products <ArrowRightOutlined />
                                        </Button>
                                    </Card>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                )}
            </div>

            {/* Benefits Section - Keeping this from your sample */}
            <div className="benefits-section">
                <div className="benefits-container">
                    <Title level={2} className="section-title">
                        Why Choose Bamboo Products?
                    </Title>

                    <Row gutter={[32, 32]}>
                        {[
                            { title: 'Eco-Friendly', description: 'Bamboo is one of the most sustainable resources on the planet' },
                            { title: 'Durable', description: 'Stronger than many hardwoods yet lightweight and flexible' },
                            { title: 'Beautiful', description: 'Natural aesthetic that complements any interior design' },
                            { title: 'Renewable', description: 'Grows rapidly without the need for pesticides or fertilizers' },
                        ].map((benefit, index) => (
                            <Col xs={24} md={12} lg={6} key={index}>
                                <div className="benefit-item">
                                    <CheckCircleOutlined className="benefit-icon" />
                                    <Title level={4} className="benefit-title">{benefit.title}</Title>
                                    <Paragraph className="benefit-description">{benefit.description}</Paragraph>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Featured Products Grid */}
            <div className="section products-section">
                <Title level={2} className="section-title">
                    Featured Products
                </Title>

                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : products.length === 0 ? (
                    <Empty description="No products found" />
                ) : (
                    <Row gutter={[24, 32]} className="products-grid">
                        {products.slice(0, 8).map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <Card
                                    hoverable
                                    className="product-card"
                                    cover={
                                        <div className="product-image-container">
                                            <img
                                                alt={product.name}
                                                src={product.imageUrl}
                                                className="product-image"
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
                                    }
                                >
                                    <div className="product-category">
                                        {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                                    </div>
                                    <Card.Meta
                                        title={<Text strong className="product-name">{product.name}</Text>}
                                        description={<Text className="product-description">{product.description}</Text>}
                                    />
                                    <div className="product-footer">
                                        <div className="product-price">
                                            ${product.price.toFixed(2)}
                                        </div>
                                        <Button
                                            type="primary"
                                            icon={<ShoppingOutlined />}
                                            className="add-to-cart-btn"
                                            disabled={product.stock === 0}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                <div className="view-all-container">
                    <Button
                        type="primary"
                        size="large"
                        className="view-all-btn"
                    >
                        View All Products <ArrowRightOutlined />
                    </Button>
                </div>
            </div>

            {/* Newsletter Section - Keeping this from your sample */}
            <div className="newsletter-section">
                <Title level={3} className="newsletter-title">
                    Ready to explore our collection?
                </Title>
                <Paragraph className="newsletter-text">
                    Join our community of eco-conscious customers and be the first to know about new products and special offers.
                </Paragraph>
                <Button
                    type="primary"
                    size="large"
                    className="shop-all-btn"
                >
                    Shop All Products <ArrowRightOutlined />
                </Button>
            </div>
        </FacingLayout>
    );
};

export default Landing;