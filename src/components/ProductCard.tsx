import { Card } from 'antd';
import { Product } from '../types/types';

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Card
            hoverable
            title={product.name}
            cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: 'cover' }} />}
        >
            <p>{product.description}</p>
            <p style={{ fontWeight: 'bold' }}>${product.price}</p>
        </Card>
    );
};

export default ProductCard;
