import { Button, Dropdown, Menu, Table } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {Coupon, Product} from '../types/types';
import dayjs from 'dayjs';

interface CouponsTableProps {
    coupons: Coupon[];
    products: Product[];
    onEdit: (coupon: Coupon) => void;
    onDelete: (coupon: Coupon) => void;
}

const CouponsTable = ({ coupons, products, onEdit, onDelete }: CouponsTableProps) => {
    const handleMenuClick = (key: string, record: Coupon) => {
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
            width: 60,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            ellipsis: true,
        },
        {
            title: 'Product',
            dataIndex: 'productId',
            key: 'productId',
            width: 140,
            ellipsis: true,
            align: 'center',
            render: (productId: number) => {
                const product = products.find((prod) => prod.id === productId);
                return product ? product.name : '';
            },
        },
        {
            title: 'Discount',
            dataIndex: 'discountRate',
            key: 'discountRate',
            render: (rate: number) => `${(rate).toFixed(0)}%`,
            align: 'center',
            width: 100,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
            width: 120,
            align: 'center',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
            width: 120,
            align: 'center',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: unknown, record: Coupon) => {
                const menu = (
                    <Menu
                        onClick={({ key }) => handleMenuClick(key, record)}
                        items={[
                            { key: 'update', label: 'Update' },
                            { key: 'delete', label: 'Delete' },
                        ]}
                    />
                );

                return (
                    <Dropdown
                        overlay={menu}
                        arrow={{ pointAtCenter: true }}
                        placement="bottomCenter"
                        trigger={['click']}
                    >
                        <Button icon={<InfoCircleOutlined />} />
                    </Dropdown>
                );
            },
            align: 'center',
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
                showSizeChanger: true,
            }}
        />
    );
};

export default CouponsTable;
