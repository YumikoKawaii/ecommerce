import { Button, Table, Typography, Tag, Space, Tooltip } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined,
    ShopOutlined
} from '@ant-design/icons';
import { Supplier } from '../types/types';

interface SuppliersTableProps {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onDelete: (supplier: Supplier) => void;
}

const { Text } = Typography;

const SuppliersTable = ({ suppliers, onEdit, onDelete }: SuppliersTableProps) => {
    const columns = [
        {
            title: 'Supplier',
            key: 'supplier',
            width: 280,
            render: (record: Supplier) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: '#E8EECC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #B7CA79'
                    }}>
                        <ShopOutlined style={{ fontSize: 24, color: '#558B2F' }} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: '16px', display: 'block', color: '#558B2F' }}>
                            {record.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            ID: {record.id}
                        </Text>
                    </div>
                </div>
            ),
            sorter: (a: Supplier, b: Supplier) => a.name.localeCompare(b.name),
        },
        {
            title: 'Contact Information',
            key: 'contact',
            width: 280,
            render: (record: Supplier) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <PhoneOutlined style={{ color: '#75A742' }} />
                        <Text>{record.phoneNumber || 'N/A'}</Text>
                    </Space>
                    <Space>
                        <MailOutlined style={{ color: '#75A742' }} />
                        <Text>{record.email || 'N/A'}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Address',
            key: 'address',
            width: 300,
            render: (record: Supplier) => (
                <Space>
                    <HomeOutlined style={{ color: '#75A742' }} />
                    <Text ellipsis={{ tooltip: record.address }}>
                        {record.address || 'No address provided'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 120,
            align: 'center' as const,
            render: (_: unknown) => (
                <Tag color="#E8EECC" style={{ color: '#558B2F', border: '1px solid #B7CA79', padding: '4px 8px' }}>
                    Active
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'center' as const,
            render: (_: unknown, record: Supplier) => {
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
            dataSource={suppliers}
            rowKey="id"
            pagination={{
                defaultCurrent: 1,
                defaultPageSize: 5,
                pageSizeOptions: [5, 10, 15],
                showTotal: (total) => `Total ${total} suppliers`,
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

export default SuppliersTable;