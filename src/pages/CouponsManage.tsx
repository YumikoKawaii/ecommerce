import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {Coupon, Product} from "../types/types.ts";
import {fetchCoupons} from "../services/couponsService.ts";
import CouponsTable from "../components/CouponsTable.tsx";
import {fetchProducts} from "../services/productsService.ts";

const CouponsManage = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCoupons()
            .then(setCoupons)

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

    const filteredCoupons = coupons.filter(coupon =>
        coupon.name.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return <Spin tip="Loading..." style={{ display: 'block', margin: '80px auto' }} />;
    }

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col flex="auto">
                    <Input.Search
                        placeholder="Search Coupons"
                        allowClear
                        enterButton
                        onSearch={handleSearch}
                        style={{ maxWidth: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add Coupon
                    </Button>
                </Col>
            </Row>

            <CouponsTable coupons={filteredCoupons} products={products}/>
        </>
    );
};

export default CouponsManage;
