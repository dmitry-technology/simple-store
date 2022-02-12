import { UserData } from "../models/user-data";
import { PayloadAction } from "@reduxjs/toolkit";
import ErrorType from "../models/error-types";
import { Product } from "../models/product";
import { Category } from "../models/category-type";
import { Order } from "../models/order-type";
import { clientStore } from "../config/servicesConfig";
import { NotificationType, UserNotificationMessage } from "../models/user-notification";

export const SET_USER_DATA = "set_user_data";
export const SET_PRODUCTS = "set_products";
export const SET_ERROR_CODE = "set_error_code";
export const SET_CATEGORIES = "set_categories";
export const SET_ORDER_DATA = "set_order_data";
export const SET_CLIENT_DATA = "set_client_data";
export const SET_USER_NOTIFICATION = "set_user_notification";

type ActionType<T> = (data: T) => PayloadAction<T>;

export const setUserData: ActionType<UserData> = userData => (
    { payload: userData, type: SET_USER_DATA }
)

export const setErrorCode: ActionType<ErrorType> = errorCode => (
    { payload: errorCode, type: SET_ERROR_CODE }
)

export const setProducts: ActionType<Product[]> = products => (
    { payload: products, type: SET_PRODUCTS }
)

export const setCategories: ActionType<Category[]> = categories => (
    { payload: categories, type: SET_CATEGORIES }
)

export const setOrders: ActionType<Order[]> = order => (
    { payload: order, type: SET_ORDER_DATA }
)

export const setClients: ActionType<UserData[]> = client => (
    { payload: client, type: SET_CLIENT_DATA }
)

export const setNotificationMessage: ActionType<UserNotificationMessage> = message => (
    { payload: message, type: SET_USER_NOTIFICATION }
)

export const updateProfile = function(userdata: UserData): (dispatch: any) => void {
    return async dispatch => {
        try {
            // Deleting fields that do not need to be saved in the database
            delete userdata.isAdmin;
            delete userdata.isFirstLogin;
            
            await clientStore.update(userdata.id, userdata);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({message: 'Profile has been updated', type: NotificationType.SUCCESS}));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({message: 'Error: Can`t update profile.', type: NotificationType.ERROR}));
        }
    }
}

