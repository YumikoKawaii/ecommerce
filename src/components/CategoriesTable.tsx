import { Button, Dropdown, Menu, Table, Typography, Space, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { Category } from '../types/types';

interface CategoriesTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

const { Text } = Typography;

const CategoriesTable = ({ categories, onEdit, onDelete }: CategoriesTableProps) => {
    const handleMenuClick = (key: string, record: Category) => {
        if (key === 'update') {
            onEdit(record);
        } else if (key === 'delete') {
            onDelete(record);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center' as const,
            render: (id: number) => (
                <Tag color="#F1F8E5" style={{ color: '#558B2F', borderColor: '#B7CA79' }}>
                    {id}
                </Tag>
            ),
        },
        {
            title: 'Category',
            key: 'category',
            width: 350,
            render: (record: Category) => (
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
                        <Text strong style={{ fontSize: '16px', display: 'block', color: '#558B2F' }}>
                            {record.name}
                        </Text>
                        <Text type="secondary" ellipsis style={{ maxWidth: 230 }}>
                            {record.description?.substring(0, 60)}{record.description?.length > 60 ? '...' : ''}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Products',
            key: 'products',
            width: 120,
            align: 'center' as const,
            render: () => {
                // Placeholder for product count - in a real app, you would calculate this
                const count = Math.floor(Math.random() * 20); // Just for demo
                return (
                    <Tag color="#E8EECC" style={{
                        color: '#75A742',
                        borderColor: '#B7CA79',
                        padding: '4px 12px',
                        fontSize: '14px'
                    }}>
                        {count} products
                    </Tag>
                );
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            align: 'left' as const,
            render: (description: string) => (
                <Text ellipsis={{ tooltip: description }}>
                    {description || 'No description available'}
                </Text>
            ),
            width: 300,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'center' as const,
            render: (_: unknown, record: Category) => {
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
            dataSource={categories}
            rowKey="id"
            pagination={{
                defaultCurrent: 1,
                defaultPageSize: 5,
                pageSizeOptions: [5, 10, 15],
                showTotal: (total) => `Total ${total} categories`,
                style: {
                    marginTop: 16,
                    color: '#558B2F'
                }
            }}
            scroll={{ x: 'max-content' }}
            rowClassName={() => 'bamboo-table-row'}
            className="bamboo-product-table"
            style={{ marginTop: 16 }}
        />
    );
};

export default CategoriesTable;