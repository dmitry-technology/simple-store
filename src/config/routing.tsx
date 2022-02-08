import { RouteType } from "../models/route-type";
import Index from "../components/pages";
import Catalog from "../components/pages/admin/catalog";
import OrdersList from "../components/pages/admin/ordersList";
import Login from "../components/pages/auth/login";
import Logout from "../components/pages/auth/logout";
import Orders from "../components/pages/orders";
import Profile from "../components/pages/profile";
import ShoppingCart from "../components/pages/shopping-cart";
import EmailVerifycation from "../components/pages/auth/verifycation";

// Common routes (available without authorization)
export const PATH_INDEX = "/";
export const PATH_LOGIN = "/login";
export const PATH_LOGOUT = "/logout";
export const PATH_EMAIL_VERIFY = "/login/verify";

// User routes
export const PATH_PROFILE = "/user/profile";
export const PATH_ORDERS = "/user/orders";
export const PATH_SHOPPING_CART = "/user/cart";

// Admin routes
export const PATH_ADMIN_ORDERS_LIST = "/admin/orders-list";
export const PATH_ADMIN_CATALOG = "/admin/catalog";

export const menuRoutes: RouteType[] = [
    { path: PATH_INDEX, element: <Index />, label: 'Pizza', isGuest: true, isUser: true, isAdmin: true },
    { path: PATH_PROFILE, element: <Profile />, label: 'Profile', isUser: true },
    { path: PATH_ORDERS, element: <Orders />, label: 'Orders', isUser: true },
    { path: PATH_SHOPPING_CART, element: <ShoppingCart />, label: 'Cart', isGuest: true, isUser: true },
    { path: PATH_ADMIN_ORDERS_LIST, element: <OrdersList />, label: 'Orders List', isAdmin: true },
    { path: PATH_ADMIN_CATALOG, element: <Catalog />, label: 'Catalog', isAdmin: true }
];

export const systemRoutes: RouteType[] = [
    { path: PATH_EMAIL_VERIFY, element: <EmailVerifycation />, label: 'Email Verify', isGuest: true }
];

export const authRoutes: RouteType[] = [
    { path: PATH_LOGIN, element: <Login />, label: 'Sign in', isGuest: true },
    { path: PATH_LOGOUT, element: <Logout />, label: 'Sign out', isUser: true, isAdmin: true }
];

export const routes: RouteType[] = [
    ...menuRoutes
];
