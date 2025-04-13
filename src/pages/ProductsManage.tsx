import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Product } from "../types/types.ts";
import { fetchProducts } from "../services/productsService.ts";
import ProductsTable from "../components/ProductsTable.tsx";

const ProductsManage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());
    };

    const handleAdd = () => {
        console.log("Add product");
        // Add product logic here
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return <Spin tip="Loading..." style={{ display: 'block', margin: '80px auto' }} />;
    }

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col flex="auto">
                    <Input.Search
                        placeholder="Search products"
                        allowClear
                        enterButton
                        onSearch={handleSearch}
                        style={{ maxWidth: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add Product
                    </Button>
                </Col>
            </Row>

            <ProductsTable products={filteredProducts} />
        </>
    );
};

export default ProductsManage;
