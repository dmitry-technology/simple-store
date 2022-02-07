import { RouteType } from "../models/route-type";
import Index from "../pages";
import Catalog from "../pages/admin/catalog";
import OrdersList from "../pages/admin/ordersList";
import Login from "../pages/login";
import Logout from "../pages/logout";
import Orders from "../pages/orders";
import Profile from "../pages/profile";
import ShoppingCart from "../pages/shopping-cart";

// Common routes (available without authorization)
export const PATH_INDEX = "/";
export const PATH_LOGIN = "/login";

// User routes
export const PATH_LOGOUT = "/user/profile/logout";
export const PATH_PROFILE = "/user/profile";
export const PATH_ORDERS = "/user/orders";
export const PATH_SHOPPING_CART = "/user/cart";

// Admin routes
export const PATH_ADMIN_ORDERS_LIST = "/admin/orders-list";
export const PATH_ADMIN_CATALOG = "/admin/catalog";


export const routes: RouteType[] = [
    {path: PATH_INDEX, element: <Index />, label: 'Pizza', authenticated: true},
    {path: PATH_LOGIN, element: <Login />, label: 'Sign in', authenticated: true},
    {path: PATH_LOGOUT, element: <Logout />, label: 'Sign out', authenticated: true},
    {path: PATH_PROFILE, element: <Profile />, label: 'Profile', authenticated: true},
    {path: PATH_ORDERS, element: <Orders />, label: 'Orders', authenticated: true},
    {path: PATH_SHOPPING_CART, element: <ShoppingCart />, label: 'Cart', authenticated: true},
    {path: PATH_ADMIN_ORDERS_LIST, element: <OrdersList />, label: 'Orders List', authenticated: true},
    {path: PATH_ADMIN_CATALOG, element: <Catalog />, label: 'Catalog', authenticated: true}
];
