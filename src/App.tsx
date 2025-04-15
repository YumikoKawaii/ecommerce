// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductsManage from './pages/ProductsManage';
import CategoriesManage from './pages/CategoriesManage';
import AdminLayout from './components/AdminLayout';
import CouponsManage from "./pages/CouponsManage.tsx";
import SuppliersManage from "./pages/SuppliersManage.tsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/products" element={<AdminLayout><ProductsManage /></AdminLayout>} />
                <Route path="/categories" element={<AdminLayout><CategoriesManage /></AdminLayout>} />
                <Route path="/coupons" element={<AdminLayout><CouponsManage /></AdminLayout>} />
                <Route path="/suppliers" element={<AdminLayout><SuppliersManage /></AdminLayout>} />
                {/* Optional: redirect or fallback */}
                <Route path="*" element={<AdminLayout><ProductsManage /></AdminLayout>} />
            </Routes>
        </Router>
    );
};

export default App;
