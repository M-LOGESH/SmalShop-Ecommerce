import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

function MainLayout() {
    const location = useLocation();
    const mobileHeaderPages = ['/account', '/profile', '/my-orders', '/view-orders'];
    const needsPadding = !mobileHeaderPages.some(
        (path) => location.pathname === path || location.pathname.startsWith(path + '/')
    );

    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Main content */}
            <div
                className={`flex-grow pb-18 sm:pt-18 lg:pb-0 ${
                    needsPadding ? (isAdminPage ? 'pt-14' : 'pt-24 sm:pt-18') : ''
                }`}
            >
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default MainLayout;
