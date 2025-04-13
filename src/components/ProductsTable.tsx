import {Button, Dropdown, Menu, Table} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Product } from '../types/types';

interface ProductTableProps {
    products: Product[];
}

const handleMenuClick = (key: string, record: Product) => {
    if (key === 'update') {
        // Handle update logic
        console.log('Update', record);
    } else if (key === 'delete') {
        // Handle delete logic
        console.log('Delete', record);
    }
};

const ProductTable = ({ products }: ProductTableProps) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => (
                <img src={image} alt="product" style={{ width: 60, height: 60, objectFit: 'cover' }} />
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
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Product) => {
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
            dataSource={products}
            rowKey="id"
            pagination={{
                defaultCurrent: 1,
                defaultPageSize: 5,
                pageSizeOptions: [5, 10, 15],
            }}
        />
    );
};

export default ProductTable;
