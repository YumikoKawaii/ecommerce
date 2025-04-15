import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Supplier } from "../types/types.ts";
import { fetchSuppliers } from "../services/suppliersService.ts";
import SuppliersTable from "../components/SuppliersTable.tsx";

const SuppliersManage = () => {
    const [Suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSuppliers()
            .then(setSuppliers)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());
    };

    const handleAdd = () => {
        console.log("Add Supplier");
        // Add Supplier logic here
    };

    const filteredSuppliers = Suppliers.filter(Supplier =>
        Supplier.name.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return <Spin tip="Loading..." style={{ display: 'block', margin: '80px auto' }} />;
    }

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col flex="auto">
                    <Input.Search
                        placeholder="Search Suppliers"
                        allowClear
                        enterButton
                        onSearch={handleSearch}
                        style={{ maxWidth: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add Supplier
                    </Button>
                </Col>
            </Row>

            <SuppliersTable suppliers={filteredSuppliers} />
        </>
    );
};

export default SuppliersManage;
