import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer.jsx";

function MainLayout() {
    const location = useLocation();
    const mobileHeaderPages = ["/account", "/profile", "/my-orders", "/view-orders"];

    const isAdminPage = location.pathname.startsWith("/admin");
    const needsPadding = !mobileHeaderPages.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Main content */}
            <div
                className={`flex-grow sm:pt-18 pb-18 lg:pb-0 ${
                    needsPadding ? (isAdminPage ? "pt-14" : "pt-24 sm:pt-18") : ""
                }`}
            >
                <Outlet />
            </div>
            <Footer />          
        </div>
    );
}

export default MainLayout;
