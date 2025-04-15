import {Button, Dropdown, Menu, Table} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {Supplier} from '../types/types';

interface SuppliersTableProps {
    suppliers: Supplier[];
}

const handleMenuClick = (key: string, record: Supplier) => {
    if (key === 'update') {
        // Handle update logic
        console.log('Update', record);
    } else if (key === 'delete') {
        // Handle delete logic
        console.log('Delete', record);
    }
};

const SuppliersTable = ({ suppliers }: SuppliersTableProps) => {
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
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Supplier) => {
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
            dataSource={suppliers}
            rowKey="id"
            pagination={{
                defaultCurrent: 1,
                defaultPageSize: 5,
                pageSizeOptions: [5, 10, 15],
            }}
        />
    );
};

export default SuppliersTable;
