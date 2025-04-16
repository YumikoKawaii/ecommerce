import { Button, Table, Typography, Tag, Badge, Space, Tooltip } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StopOutlined
} from '@ant-design/icons';
import { Coupon, Product } from '../types/types';
import dayjs from 'dayjs';

interface CouponsTableProps {
    coupons: Coupon[];
    products: Product[];
    onEdit: (coupon: Coupon) => void;
    onDelete: (coupon: Coupon) => void;
}

const { Text } = Typography;

const CouponsTable = ({ coupons, products, onEdit, onDelete }: CouponsTableProps) => {
    // Function to get coupon status
    const getCouponStatus = (startDate: string, endDate: string) => {
        const today = dayjs();
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (today.isBefore(start)) {
            return {
                status: 'upcoming',
                color: '#8BC34A',
                icon: <ClockCircleOutlined />,
                text: 'Upcoming'
            };
        } else if (today.isAfter(end)) {
            return {
                status: 'expired',
                color: '#9E9E9E',
                icon: <StopOutlined />,
                text: 'Expired'
            };
        } else {
            // Check if expiring soon (within 7 days)
            const daysRemaining = end.diff(today, 'day');
            if (daysRemaining <= 7) {
                return {
                    status: 'expiring',
                    color: '#FF8F00',
                    icon: <ClockCircleOutlined />,
                    text: `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
                };
            } else {
                return {
                    status: 'active',
                    color: '#558B2F',
                    icon: <CheckCircleOutlined />,
                    text: 'Active'
                };
            }
        }
    };

    const columns = [
        {
            title: 'Coupon',
            key: 'coupon',
            width: 300,
            render: (record: Coupon) => {
                const { color, icon, text: statusText } = getCouponStatus(record.startDate, record.endDate);
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Text strong style={{ fontSize: '16px', display: 'block', color: '#558B2F' }}>
                            {record.name}
                        </Text>
                        <Tag
                            icon={icon}
                            color={color === '#558B2F' ? '#E8EECC' : color === '#FF8F00' ? '#FFF8E1' : color === '#9E9E9E' ? '#F5F5F5' : '#F1F8E5'}
                            style={{
                                color: color,
                                border: `1px solid ${color === '#558B2F' ? '#B7CA79' : color === '#FF8F00' ? '#FFECB3' : color === '#9E9E9E' ? '#E0E0E0' : '#DCE8BB'}`,
                                padding: '4px 8px'
                            }}
                        >
                            {statusText}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            width: 150,
            align: 'center' as const,
            render: (code: string) => (
                <Tag style={{
                    background: 'linear-gradient(135deg, #F8F9E8 0%, #E8EECC 100%)',
                    border: '1px solid #E8EECC',
                    color: '#558B2F',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    padding: '4px 8px'
                }}>
                    {code}
                </Tag>
            ),
        },
        {
            title: 'Discount',
            dataIndex: 'discountRate',
            key: 'discountRate',
            width: 120,
            align: 'center' as const,
            render: (rate: number) => (
                <Text strong style={{ color: '#558B2F', fontSize: '16px' }}>
                    {rate}%
                </Text>
            ),
            sorter: (a: Coupon, b: Coupon) => a.discountRate - b.discountRate,
        },
        {
            title: 'Product',
            dataIndex: 'productId',
            key: 'productId',
            width: 200,
            align: 'center' as const,
            render: (productId: number) => {
                const product = products.find((prod) => prod.id === productId);
                return product ? (
                    <Tag color="#F1F8E5" style={{ color: '#75A742', border: '1px solid #B7CA79', padding: '4px 8px' }}>
                        {product.name}
                    </Tag>
                ) : '';
            },
            filters: products.map(prod => ({ text: prod.name, value: prod.id })),
            onFilter: (value: any, record: Coupon) => record.productId === value,
        },
        {
            title: 'Validity Period',
            key: 'validity',
            width: 200,
            align: 'center' as const,
            render: (_, record: Coupon) => {
                const start = dayjs(record.startDate).format('MMM D, YYYY');
                const end = dayjs(record.endDate).format('MMM D, YYYY');
                const today = dayjs();
                const endDate = dayjs(record.endDate);
                const daysRemaining = endDate.diff(today, 'day');

                let badgeColor = '#52c41a'; // Green for good days remaining
                if (daysRemaining <= 0) {
                    badgeColor = '#9E9E9E'; // Grey for expired
                } else if (daysRemaining <= 7) {
                    badgeColor = '#ff4d4f'; // Red for close to expiry
                } else if (daysRemaining <= 14) {
                    badgeColor = '#faad14'; // Yellow for approaching expiry
                }

                return (
                    <Space direction="vertical" size="small">
                        <Space>
                            <Text style={{ whiteSpace: 'nowrap' }}>
                                {start} <span style={{ color: '#9E9E9E' }}>to</span> {end}
                            </Text>
                        </Space>
                        {!today.isAfter(endDate) && (
                            <Badge
                                color={badgeColor}
                                text={
                                    <Text style={{ color: badgeColor }}>
                                        {daysRemaining <= 0
                                            ? 'Expired'
                                            : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`}
                                    </Text>
                                }
                            />
                        )}
                    </Space>
                );
            },
            sorter: (a: Coupon, b: Coupon) => dayjs(a.endDate).unix() - dayjs(b.endDate).unix(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'center' as const,
            render: (_: unknown, record: Coupon) => {
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
            dataSource={coupons}
            rowKey="id"
            pagination={{
                defaultCurrent: 1,
                defaultPageSize: 5,
                pageSizeOptions: [5, 10, 15],
                showTotal: (total) => `Total ${total} coupons`,
                style: {
                    marginTop: 16,
                    color: '#558B2F'
                }
            }}
            scroll={{ x: 'max-content' }}
            rowClassName={(record) => {
                const { status } = getCouponStatus(record.startDate, record.endDate);
                return `bamboo-table-row ${status === 'expired' ? 'expired-row' : ''}`;
            }}
            className="bamboo-product-table"
        />
    );
};

export default CouponsTable;