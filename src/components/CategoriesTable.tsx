import { Button, Dropdown, Menu, Table } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {Category} from '../types/types';

interface CategoriesTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

const CategoriesTable = ({ categories, onEdit, onDelete }: CategoriesTableProps) => {
    const handleMenuClick = (key: string, record: Category) => {
        if (key === 'update') {
            onEdit(record);
        } else if (key === 'delete') {
            onDelete(record)
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
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl: string) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={imageUrl}
                        alt="category"
                        style={{ width: 200, height: 150, objectFit: 'cover' }}
                    />
                </div>
            ),
            align: 'center',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: unknown, record: Category) => {
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
            dataSource={categories}
            rowKey="id"
            pagination={{
                defaultCurrent: 1,
                defaultPageSize: 5,
                pageSizeOptions: [5, 10, 15],
            }}
        />
    );
};

export default CategoriesTable;
