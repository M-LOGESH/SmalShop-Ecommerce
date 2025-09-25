import { Outlet, useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();
  const mobileHeaderPages = ["/account", "/profile", "/cart", "/orders"];
  const needsPadding = !mobileHeaderPages.includes(location.pathname);

  return (
    <div className={needsPadding ? "pt-24 sm:pt-20 px-3 pb-23" : "sm:pt-20 pb-18 lg:pb-10"}>
      <Outlet />
    </div>
  );
}

export default MainLayout;
