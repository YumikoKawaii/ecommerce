import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, Spin, Empty, Breadcrumb, Select, Pagination } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, ShoppingOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import FacingLayout from '../components/FacingLayout';
import { Product, Category } from '../types/types';
import { fetchProducts } from "../services/productsService";
import { fetchCategories } from "../services/categoriesService";
import '../css/CategoryProducts.css';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const CategoryProducts = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortOption, setSortOption] = useState<string>('default');
    const [priceRange, setPriceRange] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 12;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const productsData = await fetchProducts();
                const categoriesData = await fetchCategories();

                setProducts(productsData);
                setCategories(categoriesData);

                // Find the current category
                const category = categoriesData.find(c => c.id === Number(categoryId));
                setCurrentCategory(category || null);

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // Reset to first page when changing categories
        setCurrentPage(1);
        // Reset filters when changing categories
        setSortOption('default');
        setPriceRange('all');
        setStockFilter('all');

        // Scroll to top when component mounts or category changes
        window.scrollTo(0, 0);
    }, [categoryId]);

    useEffect(() => {
        // Filter products by category
        let filtered = categoryId
            ? products.filter(product => product.categoryId === Number(categoryId))
            : products;

        // Apply stock filter
        if (stockFilter === 'inStock') {
            filtered = filtered.filter(product => product.stock > 0);
        } else if (stockFilter === 'outOfStock') {
            filtered = filtered.filter(product => product.stock === 0);
        } else if (stockFilter === 'lowStock') {
            filtered = filtered.filter(product => product.stock > 0 && product.stock <= 5);
        }

        // Apply price range filter
        if (priceRange === 'under25') {
            filtered = filtered.filter(product => product.price < 25);
        } else if (priceRange === '25to50') {
            filtered = filtered.filter(product => product.price >= 25 && product.price <= 50);
        } else if (priceRange === '50to100') {
            filtered = filtered.filter(product => product.price > 50 && product.price <= 100);
        } else if (priceRange === 'over100') {
            filtered = filtered.filter(product => product.price > 100);
        }

        // Apply sorting
        if (sortOption === 'priceLow') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'priceHigh') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'nameAZ') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'nameZA') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === 'stockHigh') {
            filtered.sort((a, b) => b.stock - a.stock);
        }

        setFilteredProducts(filtered);
    }, [products, categoryId, sortOption, priceRange, stockFilter]);

    // Calculate paginated products
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (value: string) => {
        setSortOption(value);
        setCurrentPage(1);
    };

    const handlePriceRangeChange = (value: string) => {
        setPriceRange(value);
        setCurrentPage(1);
    };

    const handleStockFilterChange = (value: string) => {
        setStockFilter(value);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSortOption('default');
        setPriceRange('all');
        setStockFilter('all');
        setCurrentPage(1);
    };

    return (
        <FacingLayout>
            <div className="category-products-container">
                {/* Breadcrumb navigation */}
                <Breadcrumb className="breadcrumb-nav">
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    {!categoryId && <Breadcrumb.Item>All Products</Breadcrumb.Item>}
                    {categoryId && (
                        <>
                            <Breadcrumb.Item>
                                <Link to="/products">Products</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{currentCategory?.name || 'Category'}</Breadcrumb.Item>
                        </>
                    )}
                </Breadcrumb>

                {/* Category Header */}
                <div className="category-header">
                    <div className="category-header-top">
                        <div className="back-button-container">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                className="back-button"
                                onClick={() => window.history.back()}
                            >
                                Back
                            </Button>
                        </div>
                        <div className="category-selector">
                            <span className="category-selector-label">Category:</span>
                            <Select
                                value={categoryId ? Number(categoryId) : 'all'}
                                onChange={(value) => {
                                    if (value === 'all') {
                                        navigate('/products');
                                    } else {
                                        navigate(`/products/category/${value}`);
                                    }
                                }}
                                className="category-select"
                            >
                                <Option value="all">All Products</Option>
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>{category.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <Title level={2} className="category-title">
                        {currentCategory ? currentCategory.name : 'All Products'}
                    </Title>
                    {currentCategory && (
                        <Paragraph className="category-description">
                            {currentCategory.description}
                        </Paragraph>
                    )}
                </div>

                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" className="loading-spin" />
                    </div>
                ) : (
                    <>
                        {/* Filter and Sort Section */}
                        <div className="filter-sort-section">
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} sm={24} md={6} lg={6}>
                                    <div className="results-count">
                                        {filteredProducts.length} products found
                                    </div>
                                </Col>
                                <Col xs={24} sm={8} md={6} lg={6}>
                                    <div className="filter-item">
                                        <FilterOutlined className="filter-icon" />
                                        <Select
                                            defaultValue="all"
                                            style={{ width: '100%' }}
                                            onChange={handleStockFilterChange}
                                            value={stockFilter}
                                            className="filter-select"
                                        >
                                            <Option value="all">All Stock</Option>
                                            <Option value="inStock">In Stock</Option>
                                            <Option value="lowStock">Low Stock</Option>
                                            <Option value="outOfStock">Out of Stock</Option>
                                        </Select>
                                    </div>
                                </Col>
                                <Col xs={24} sm={8} md={6} lg={6}>
                                    <div className="filter-item">
                                        <FilterOutlined className="filter-icon" />
                                        <Select
                                            defaultValue="all"
                                            style={{ width: '100%' }}
                                            onChange={handlePriceRangeChange}
                                            value={priceRange}
                                            className="filter-select"
                                        >
                                            <Option value="all">All Prices</Option>
                                            <Option value="under25">Under $25</Option>
                                            <Option value="25to50">$25 - $50</Option>
                                            <Option value="50to100">$50 - $100</Option>
                                            <Option value="over100">Over $100</Option>
                                        </Select>
                                    </div>
                                </Col>
                                <Col xs={24} sm={8} md={6} lg={6}>
                                    <div className="filter-item">
                                        <SortAscendingOutlined className="filter-icon" />
                                        <Select
                                            defaultValue="default"
                                            style={{ width: '100%' }}
                                            onChange={handleSortChange}
                                            value={sortOption}
                                            className="filter-select"
                                        >
                                            <Option value="default">Default Sorting</Option>
                                            <Option value="priceLow">Price: Low to High</Option>
                                            <Option value="priceHigh">Price: High to Low</Option>
                                            <Option value="nameAZ">Name: A to Z</Option>
                                            <Option value="nameZA">Name: Z to A</Option>
                                            <Option value="stockHigh">Stock: High to Low</Option>
                                        </Select>
                                    </div>
                                </Col>
                            </Row>

                            {(stockFilter !== 'all' || priceRange !== 'all' || sortOption !== 'default') && (
                                <div className="active-filters">
                                    <Text className="active-filters-text">Active Filters:</Text>
                                    {stockFilter !== 'all' && (
                                        <Button size="small" className="filter-tag" onClick={() => setStockFilter('all')}>
                                            {stockFilter === 'inStock' ? 'In Stock' :
                                                stockFilter === 'lowStock' ? 'Low Stock' : 'Out of Stock'} ✕
                                        </Button>
                                    )}
                                    {priceRange !== 'all' && (
                                        <Button size="small" className="filter-tag" onClick={() => setPriceRange('all')}>
                                            {priceRange === 'under25' ? 'Under $25' :
                                                priceRange === '25to50' ? '$25 - $50' :
                                                    priceRange === '50to100' ? '$50 - $100' : 'Over $100'} ✕
                                        </Button>
                                    )}
                                    {sortOption !== 'default' && (
                                        <Button size="small" className="filter-tag" onClick={() => setSortOption('default')}>
                                            {sortOption === 'priceLow' ? 'Price: Low to High' :
                                                sortOption === 'priceHigh' ? 'Price: High to Low' :
                                                    sortOption === 'nameAZ' ? 'Name: A to Z' :
                                                        sortOption === 'nameZA' ? 'Name: Z to A' :
                                                            'Stock: High to Low'} ✕
                                        </Button>
                                    )}
                                    <Button size="small" type="primary" onClick={resetFilters} className="reset-filters-btn">
                                        Clear All
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length === 0 ? (
                            <Empty
                                description="No products found matching your criteria"
                                className="no-products-message"
                            />
                        ) : (
                            <>
                                <Row gutter={[24, 32]} className="products-grid">
                                    {paginatedProducts.map((product) => (
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

                                {/* Pagination */}
                                {filteredProducts.length > pageSize && (
                                    <div className="pagination-container">
                                        <Pagination
                                            current={currentPage}
                                            total={filteredProducts.length}
                                            pageSize={pageSize}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Related Categories Section - shown for both "all products" and single category views */}
                {categories.length > 1 && (
                    <div className="related-categories-section">
                        <Title level={3} className="section-title">
                            {categoryId ? 'Explore Other Categories' : 'Browse All Categories'}
                        </Title>
                        <Row gutter={[16, 16]}>
                            {categories
                                .filter(category => !categoryId || category.id !== Number(categoryId))
                                .slice(0, 8) // Limit to 8 categories
                                .map(category => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
                                        <Link to={`/products/category/${category.id}`} className="related-category-link">
                                            <Card
                                                hoverable
                                                className="related-category-card"
                                                cover={
                                                    <img
                                                        alt={category.name}
                                                        src={category.imageUrl}
                                                        className="related-category-image"
                                                    />
                                                }
                                            >
                                                <Card.Meta
                                                    title={category.name}
                                                />
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

export default CategoryProducts;