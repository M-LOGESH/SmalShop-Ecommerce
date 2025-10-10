import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductsProvider } from './context/ProductsContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import { AdminUsersProvider } from './context/AdminUsersContext.jsx';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <OrdersProvider>
            <AdminUsersProvider>
                <ProductsProvider>
                    <App />
                </ProductsProvider>
            </AdminUsersProvider>
        </OrdersProvider>
    </AuthProvider>
);