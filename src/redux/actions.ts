import { UserData } from "../models/user-data";
import { PayloadAction } from "@reduxjs/toolkit";
import ErrorType from "../models/error-types";

export const SET_USER_DATA = "set_user_data";
export const SET_ERROR_CODE = "set_error_code";

type ActionType<T> = (data: T) => PayloadAction<T>;

export const setUserData: ActionType<UserData> = userData => (
    {payload: userData, type: SET_USER_DATA}
)

export const setErrorCode: ActionType<ErrorType> = errorCode => (
    {payload: errorCode, type: SET_ERROR_CODE}
)

