import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { Category } from "../models/category-type";
import ErrorType from "../models/error-types";
import { Order } from "../models/order-type";
import { Product, ProductBatch } from "../models/product";
import { UserData } from "../models/user-data";
import { UserNotificationMessage } from "../models/user-notification";
import { categoriesReducer, errorCodeReducer, productsReducer, userDataReducer, ordersReducer, clientsReducer, notificationReducer, cartReducer } from "./reducers";

type StoreType = {
    userData: UserData,
    errorCode: ErrorType,
    products: Product[],
    categories: Category[],
    orders: Order[],
    clients: UserData[],
    notification: UserNotificationMessage,
    shoppingCart: ProductBatch[]
};

const reducers = combineReducers<StoreType>({
    userData: userDataReducer,
    errorCode: errorCodeReducer,
    products: productsReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
    clients: clientsReducer,
    notification: notificationReducer,
    shoppingCart: cartReducer
});

// Create store
export const store = createStore(reducers, applyMiddleware(thunk));

// Create selectors in accordance with state
export const userDataSelector = (state: StoreType): UserData => state.userData;
export const errorCodeSelector = (state: StoreType): ErrorType => state.errorCode;
export const productsSelector = (state: StoreType): Product[] => state.products;
export const categoriesSelector = (state: StoreType): Category[] => state.categories;
export const ordersSelector = (state: StoreType): Order[] => state.orders;
export const clientsSelector = (state: StoreType): UserData[] => state.clients;
export const notificationSelector = (state: StoreType): UserNotificationMessage => state.notification;
export const shoppingCartSelector = (state: StoreType): ProductBatch[] => state.shoppingCart;
