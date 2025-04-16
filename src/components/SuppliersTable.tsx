import { Button, Dropdown, Menu, Table } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Supplier } from '../types/types';

interface SuppliersTableProps {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onDelete: (supplier: Supplier) => void;
}

const SuppliersTable = ({ suppliers, onEdit, onDelete }: SuppliersTableProps) => {
    const handleMenuClick = (key: string, record: Supplier) => {
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
            width: 50,
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
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
                                danger: true,
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
                showSizeChanger: true,
            }}
        />
    );
};

export default SuppliersTable;
