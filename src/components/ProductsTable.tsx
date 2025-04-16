import { Button, Dropdown, Menu, Table } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Category, Product, Supplier } from '../types/types';

interface ProductTableProps {
    products: Product[];
    categories: Category[];
    suppliers: Supplier[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

const ProductTable = ({ products, categories, suppliers, onEdit, onDelete }: ProductTableProps) => {

    const handleMenuClick = (key: string, record: Product) => {
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
            align: 'center',
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 220,
            align: 'center',
            render: (imageUrl: string) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={imageUrl}
                        alt="product"
                        style={{ width: 200, height: 150, objectFit: 'cover' }}
                    />
                </div>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            width: 250,
            align: 'center',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 100,
            align: 'right',
            render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            width: 80,
            align: 'right',
        },
        {
            title: 'Category',
            dataIndex: 'categoryId',
            key: 'categoryId',
            width: 140,
            ellipsis: true,
            align: 'center',
            render: (categoryId: number) => {
                const category = categories.find((cat) => cat.id === categoryId);
                return category ? category.name : '';
            },
        },
        {
            title: 'Supplier',
            dataIndex: 'supplierId',
            key: 'supplierId',
            width: 140,
            ellipsis: true,
            align: 'center',
            render: (supplierId: number) => {
                const supplier = suppliers.find((supp) => supp.id === supplierId);
                return supplier ? supplier.name : '';
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_: unknown, record: Product) => {
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
            scroll={{ x: 'max-content' }}
        />
    );
};

export default ProductTable;
