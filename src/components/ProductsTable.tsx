import { Button, Dropdown, Menu, Table, Typography, Tag, Badge, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, EyeOutlined } from '@ant-design/icons';
import { Category, Product, Supplier } from '../types/types';

interface ProductTableProps {
    products: Product[];
    categories: Category[];
    suppliers: Supplier[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

const { Text } = Typography;

const ProductTable = ({ products, categories, suppliers, onEdit, onDelete }: ProductTableProps) => {

    // Get color based on stock level
    const getStockStatusColor = (stock: number) => {
        if (stock <= 5) return '#ff4d4f'; // Red for low stock
        if (stock <= 20) return '#faad14'; // Yellow for medium stock
        return '#52c41a'; // Green for good stock
    };

    const columns = [
        {
            title: 'Product',
            key: 'product',
            width: 350,
            render: (record: Product) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                        src={record.imageUrl}
                        alt={record.name}
                        style={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #E8EECC' // Light bamboo border
                        }}
                    />
                    <div>
                        <Text strong style={{ fontSize: '16px', display: 'block', color: '#558B2F' }}>{record.name}</Text>
                        <Text type="secondary" ellipsis style={{ maxWidth: 230 }}>
                            {record.description?.substring(0, 60)}{record.description?.length > 60 ? '...' : ''}
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
                <Text strong style={{ color: '#558B2F', fontSize: '16px' }}>
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
                    <Tag color="#E8EECC" style={{ color: '#558B2F', border: '1px solid #B7CA79', padding: '4px 8px' }}>
                        {category.name}
                    </Tag>
                ) : '';
            },
            filters: categories.map(cat => ({ text: cat.name, value: cat.id })),
            onFilter: (value: any, record: Product) => record.categoryId === value,
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
                    <Tag color="#F1F8E5" style={{ color: '#75A742', border: '1px solid #B7CA79', padding: '4px 8px' }}>
                        {supplier.name}
                    </Tag>
                ) : '';
            },
            filters: suppliers.map(sup => ({ text: sup.name, value: sup.id })),
            onFilter: (value: any, record: Product) => record.supplierId === value,
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
                            <Text strong style={{ color: getStockStatusColor(stock) }}>
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
                                onClick={() => onEdit(record)}
                                style={{
                                    color: '#75A742',
                                    borderColor: '#B7CA79',
                                    background: '#F8F9E8'
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Button
                                icon={<DeleteOutlined />}
                                onClick={() => onDelete(record)}
                                style={{
                                    color: '#ff4d4f',
                                    borderColor: '#ffa39e',
                                    background: '#fff1f0'
                                }}
                            />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            pagination={{
                defaultCurrent: 1,
                defaultPageSize: 5,
                pageSizeOptions: [5, 10, 15],
                showTotal: (total) => `Total ${total} products`,
                style: {
                    marginTop: 16,
                    color: '#558B2F'
                }
            }}
            scroll={{ x: 'max-content' }}
            rowClassName={() => 'bamboo-table-row'}
            className="bamboo-product-table"
        />
    );
};

export default ProductTable;