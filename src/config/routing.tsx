import { RouteType } from "../models/route-type";
import Index from "../components/pages";
import Catalog from "../components/pages/admin/catalog";
import OrdersList from "../components/pages/orders";
import Login from "../components/pages/auth/login";
import Logout from "../components/pages/auth/logout";
import Profile from "../components/pages/profile";
import ShoppingCart from "../components/pages/shopping-cart";
import EmailVerification from "../components/pages/auth/verification";
import RedirectPage from "../components/pages/auth/complete";
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Common routes 
export const PATH_INDEX = "/";
export const PATH_LOGIN = "/login";
export const PATH_LOGOUT = "/logout";
export const PATH_EMAIL_VERIFY = "/login/verify";
export const PATH_REDIRECT = "/redirect";

// User routes
export const PATH_PROFILE = "/user/profile";
export const PATH_ORDERS = "/orders-list";
export const PATH_SHOPPING_CART = "/user/cart";

// Admin routes
export const PATH_ADMIN_ORDERS_LIST = "/admin/orders-list";
export const PATH_ADMIN_CATALOG = "/admin/catalog";

export const menuRoutes: RouteType[] = [
    { path: PATH_INDEX, element: <Index />, label: 'Pizza', isGuest: true, isUser: true, isAdmin: true },
    { path: PATH_PROFILE, element: <Profile />, icon: <AccountCircleIcon />, label: 'Profile', isUser: true },
    { path: PATH_ORDERS, element: <OrdersList />, icon: <LocalPizzaIcon />, label: 'Orders', isUser: true },
    { path: PATH_SHOPPING_CART, element: <ShoppingCart />, icon: <ShoppingCartIcon />, label: 'Cart', isGuest: true, isUser: true },
    { path: PATH_ADMIN_ORDERS_LIST, element: <OrdersList />, label: 'Orders List', isAdmin: true },
    { path: PATH_ADMIN_CATALOG, element: <Catalog />, label: 'Catalog', isAdmin: true }
];

export const systemRoutes: RouteType[] = [
    { path: PATH_EMAIL_VERIFY, element: <EmailVerification />, isGuest: true },
    { path: PATH_REDIRECT, element: <RedirectPage />, isGuest: true, isUser: true, isAdmin: true }
];

export const authRoutes: RouteType[] = [
    { path: PATH_LOGIN, element: <Login />, icon: <LoginIcon />, label: 'Sign in', isGuest: true },
    { path: PATH_LOGOUT, element: <Logout />, label: 'Log out', isUser: true, isAdmin: true }
];

export const routes: RouteType[] = [
    ...menuRoutes, ...systemRoutes, ...authRoutes
];
