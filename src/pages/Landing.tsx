import { useEffect, useState } from 'react';
import { Row, Col, Typography, Spin, Carousel } from 'antd';
import ProductCard from '../components/ProductCard';
import {Category, Product} from '../types/types';
import { fetchProducts } from '../services/productsService.ts';
import {fetchCategories} from "../services/categoriesService.ts";
import CategoryCard from "../components/CategoryCard.tsx";
import FeaturedProduct from "../components/FeaturedProduct.tsx";

const { Title } = Typography;

const Landing = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const images = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLj-cXLZCs1jx1lyWnkYfyNA7yLtXlroVjA&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiu-ED_frunu-znmnfghsfKNQDB78KLrB9tg&s',
        'https://m.media-amazon.com/images/I/81iuujza+0S._AC_UF894,1000_QL80_.jpg',
        'https://i.etsystatic.com/5839524/r/il/a2ba3e/2409416903/il_fullxfull.2409416903_qq1t.jpg',
    ];


    useEffect(() => {
        fetchProducts()
            .then(setProducts)
        fetchCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Spin tip="Loading..." style={{ display: 'block', margin: '80px auto' }} />;
    }

    return (
        <>
            {/* Carousel container */}
            <div style={{ width: '90vw', margin: '0 auto 40px' }}>
                <Carousel autoplay autoplaySpeed={5000} dots>
                    {[0, 1, 2, 3].map((n) => (
                        <div key={n}>
                            <img
                                src={images[n]}
                                alt={`Image ${n}`}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                        </div>
                    ))}
                </Carousel>
            </div>

            <Row gutter={[24, 24]}>
                {categories.map((category) => (
                    <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CategoryCard category={category} />
                        </div>
                    </Col>
                ))}
            </Row>

            {/*Feartured Products*/}
            <div style={{margin: '20px 0'}}>
                <FeaturedProduct products={products.slice(0, 8)}/>
            </div>

            <Title level={2}>Our Products</Title>

            {/* Product grid */}
            <Row gutter={[24, 24]}>
                {products.map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Landing;
