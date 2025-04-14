import {Button, Dropdown, Menu, Table} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {Category} from '../types/types';

interface CategoriesTableProps {
    categories: Category[];
}

const handleMenuClick = (key: string, record: Category) => {
    if (key === 'update') {
        // Handle update logic
        console.log('Update', record);
    } else if (key === 'delete') {
        // Handle delete logic
        console.log('Delete', record);
    }
};

const CategoriesTable = ({ categories }: CategoriesTableProps) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl: string) => (
                <img src={imageUrl} alt="category" style={{ width: 60, height: 60, objectFit: 'cover' }} />
            ),
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
