import { Outlet, useLocation } from 'react-router-dom';

function MainLayout() {
    const location = useLocation();
    const mobileHeaderPages = ['/account', '/profile', '/cart', '/orders'];

    const isAdminPage = location.pathname.startsWith('/admin');
    const needsPadding = !mobileHeaderPages.includes(location.pathname);

    return (
        <div
            className={`sm:pt-18 pb-18 lg:pb-0 ${
                needsPadding ? (isAdminPage ? 'pt-14' : 'pt-24 sm:pt-18') : ''
            }`}
        >
            <Outlet />
        </div>
    );
}

export default MainLayout;
