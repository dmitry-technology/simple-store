import { UserData } from "../models/user-data";
import { PayloadAction } from "@reduxjs/toolkit";
import ErrorType from "../models/error-types";
import { Product } from "../models/product";
import { Order } from "../models/order-type";
import { Client } from "../models/client-type";

export const SET_USER_DATA = "set_user_data";
export const SET_PRODUCT_DATA = "set_goods_data";
export const SET_ERROR_CODE = "set_error_code";
export const SET_ORDER_DATA = "set_order_data";
export const SET_CLIENT_DATA = "set_client_data";

type ActionType<T> = (data: T) => PayloadAction<T>;

export const setUserData: ActionType<UserData> = userData => (
    { payload: userData, type: SET_USER_DATA }
)

export const setErrorCode: ActionType<ErrorType> = errorCode => (
    { payload: errorCode, type: SET_ERROR_CODE }
)

export const setProduct: ActionType<Product> = product => (
    { payload: product, type: SET_PRODUCT_DATA }
)

export const setOrder: ActionType<Order> = order => (
    { payload: order, type: SET_ORDER_DATA }
)

export const setClient: ActionType<Client> = client => (
    { payload: client, type: SET_CLIENT_DATA }
)



