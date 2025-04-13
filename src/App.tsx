// src/App.tsx
import AppLayout from './components/AppLayout';
// import Landing from './pages/Landing.tsx';
import ProductsManage from "./pages/ProductsManage.tsx";

function App() {
    return (
        <AppLayout>
            <ProductsManage />
        </AppLayout>
    );
}

export default App;
