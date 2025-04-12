import { Row, Col, Card } from 'antd';
import {Product} from "../types/types.ts";
import ProductCard from "./ProductCard.tsx";

const FeaturedSection= ({ products }: { products: Product[] }) => {
    return (
        <Row gutter={24}>
            {/* Banner */}
            <Col span={6}>
                <Card
                    style={{ height: '100%', backgroundColor: '#f0f2f5' }}
                    bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                >
                    <h2 style={{ textAlign: 'center' }}>Special Deals</h2>
                </Card>
            </Col>

            {/* Product Cards */}
            <Col span={18}>
                <Row gutter={[16, 16]}>
                    {products.map((product) => (
                        <Col key={product.id} xs={12} sm={12} md={8} lg={6}>
                            <ProductCard product={product}/>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    );
};

export default FeaturedSection;
