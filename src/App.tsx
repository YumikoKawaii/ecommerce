// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductsManage from './pages/ProductsManage';
import CategoriesManage from './pages/CategoriesManage';
import AdminLayout from './components/AdminLayout';
import CouponsManage from "./pages/CouponsManage.tsx";
import SuppliersManage from "./pages/SuppliersManage.tsx";
import Landing from './pages/Landing.tsx';
import CategoryProducts from './pages/CategoryProducts.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import UserDetail from './pages/UserDetail'; // Import the new UserDetailPage component
import './App.css';
import { ConfigProvider } from 'antd';

const App = () => {
    // Custom theme token overrides for Ant Design
    const theme = {
        token: {
            colorPrimary: '#75A742',
            colorLink: '#558B2F',
            colorSuccess: '#8BC34A',
            borderRadius: 6,
        },
        components: {
            Button: {
                colorPrimary: '#75A742',
                colorPrimaryHover: '#8BC34A',
            },
            Menu: {
                colorItemBgSelected: '#E8EECC',
                colorItemTextSelected: '#558B2F',
            },
            Input: {
                colorPrimaryHover: '#8BC34A',
            },
            Carousel: {
                dotWidth: 10,
                dotHeight: 10,
                dotActiveWidth: 24,
            }
        }
    };

    return (
        <ConfigProvider theme={theme}>
            <Router>
                <Routes>
                    {/* Home route uses Landing component */}
                    <Route path="/" element={<Landing />} />

                    {/* Product and category routes */}
                    <Route path="/products" element={<CategoryProducts />} />
                    <Route path="/products/category/:categoryId" element={<CategoryProducts />} />
                    <Route path="/products/:productId" element={<ProductDetail />} />

                    {/* User routes */}
                    <Route path="/profile" element={<UserDetail />} />

                    {/* Admin routes with AdminLayout */}
                    <Route path="/admin/products" element={<AdminLayout><ProductsManage /></AdminLayout>} />
                    <Route path="/admin/categories" element={<AdminLayout><CategoriesManage /></AdminLayout>} />
                    <Route path="/admin/coupons" element={<AdminLayout><CouponsManage /></AdminLayout>} />
                    <Route path="/admin/suppliers" element={<AdminLayout><SuppliersManage /></AdminLayout>} />

                    {/* Redirect any other path to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ConfigProvider>
    );
};

export default App;