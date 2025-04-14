import {Button, Dropdown, Menu, Table} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {Coupon} from '../types/types';

interface CouponsTableProps {
    coupons: Coupon[];
}

const handleMenuClick = (key: string, record: Coupon) => {
    if (key === 'update') {
        // Handle update logic
        console.log('Update', record);
    } else if (key === 'delete') {
        // Handle delete logic
        console.log('Delete', record);
    }
};

const CouponsTable = ({ coupons }: CouponsTableProps) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Discount Rate',
            dataIndex: 'discountRate',
            key: 'discountRate',
            render: (rate: number) => `${(rate * 100).toFixed(0)}%`,
            ellipsis: true,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Coupon) => {
                const menu = (
                    <Menu
                        onClick={({ key }) => handleMenuClick(key, record)}
                        items={[
                            {
                                key: 'update',
                                label: 'Update',
                            },
                            {
                                key: 'delete',
                                label: 'Delete',
                            },
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
                        <Button>
                            <InfoCircleOutlined />
                        </Button>
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
            }}
        />
    );
};

export default CouponsTable;
