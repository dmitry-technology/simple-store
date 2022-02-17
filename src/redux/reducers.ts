import { PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../models/category-type";
import ErrorType from "../models/error-types";
import { Order } from "../models/order-type";
import { Product, ProductBatch } from "../models/product";
import { nonAuthorisedUser, UserData } from "../models/user-data";
import { emptyMessage, UserNotificationMessage } from "../models/user-notification";
import { SET_CATEGORIES, SET_ERROR_CODE, SET_PRODUCTS, SET_USER_DATA, SET_CLIENT_DATA, SET_ORDER_DATA, SET_USER_NOTIFICATION, SET_SHOPPING_CART } from "./actions";

export const userDataReducer = (userData: UserData = nonAuthorisedUser, action: PayloadAction<UserData>): UserData => {
    return action.type === SET_USER_DATA ? action.payload : userData;
}

export const errorCodeReducer = (errorCode: ErrorType = ErrorType.NO_ERROR, action: PayloadAction<ErrorType>): ErrorType => {
    return action.type === SET_ERROR_CODE ? action.payload : errorCode;
}

export const productsReducer = (products: Product[] = [], action: PayloadAction<Product[]>): Product[] => {
    return action.type === SET_PRODUCTS ? action.payload : products;
}

export const categoriesReducer = (categories: Category[] = [], action: PayloadAction<Category[]>): Category[] => {
    return action.type === SET_CATEGORIES ? action.payload : categories;
}

export const ordersReducer = (orders: Order[] = [], action: PayloadAction<Order[]>): Order[] => {
    return action.type === SET_ORDER_DATA ? action.payload : orders;
}

export const clientsReducer = (clients: UserData[] = [], action: PayloadAction<UserData[]>): UserData[] => {
    return action.type === SET_CLIENT_DATA ? action.payload : clients;
}

export const notificationReducer = (message: UserNotificationMessage = emptyMessage, action: PayloadAction<UserNotificationMessage>): UserNotificationMessage => {
    return action.type === SET_USER_NOTIFICATION ? action.payload : message;
}

export const cartReducer = (shoppingCart: ProductBatch[] = [], action: PayloadAction<ProductBatch[]>): ProductBatch[] => {
    return action.type === SET_SHOPPING_CART ? action.payload : shoppingCart;
}
