import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {Category} from "../types/types.ts";
import {fetchCategories} from "../services/categoriesService.ts";
import CategoriesTable from "../components/CategoriesTable.tsx";

const CategoriesManage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());
    };

    const handleAdd = () => {
        console.log("Add product");
        // Add product logic here
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return <Spin tip="Loading..." style={{ display: 'block', margin: '80px auto' }} />;
    }

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col flex="auto">
                    <Input.Search
                        placeholder="Search categories"
                        allowClear
                        enterButton
                        onSearch={handleSearch}
                        style={{ maxWidth: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add Category
                    </Button>
                </Col>
            </Row>

            <CategoriesTable categories={filteredCategories} />
        </>
    );
};

export default CategoriesManage;
