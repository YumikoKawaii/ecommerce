import { Card } from 'antd';
import { Category } from '../types/types';
import Meta from "antd/lib/card/Meta";

const CategoryCard = ({ category }: { category: Category }) => {
    return (
        <Card
            hoverable
            style={{ width: 300, borderRadius: '12px', overflow: 'hidden' }}
            cover={
                <img
                    alt="example"
                    src={category.imageUrl}
                    style={{ objectFit: 'cover', height: 200 }}
                />
            }
        >
            <Meta
                title={<div style={{ textAlign: 'center' }}>{category.name}</div>}
                // description="This is the description for the card content."
            />
        </Card>
    );
};

export default CategoryCard;
