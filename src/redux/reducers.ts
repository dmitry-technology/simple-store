import { PayloadAction } from "@reduxjs/toolkit";
import ErrorType from "../models/error-types";
import { nonAuthorisedUser, UserData } from "../models/user-data";
import { SET_ERROR_CODE, SET_USER_DATA } from "./actions";

export const userDataReducer = (userData: UserData = nonAuthorisedUser, action: PayloadAction<UserData>): UserData => {
    return action.type === SET_USER_DATA ? action.payload : userData;
}

export const errorCodeReducer = (errorCode: ErrorType = ErrorType.NO_ERROR, action: PayloadAction<ErrorType>): ErrorType => {
    return action.type === SET_ERROR_CODE ? action.payload : errorCode;
}

