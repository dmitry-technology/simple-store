import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import AuthErrorType from "../models/auth-error-types";
import ErrorType from "../models/error-types";
import { UserData } from "../models/user-data";
import { errorCodeReducer, userDataReducer } from "./reducers";

type StoreType = {userData: UserData, errorCode: ErrorType};

const reducers = combineReducers<StoreType> ({
    userData: userDataReducer,
    errorCode: errorCodeReducer
});

// Create store
export const store = createStore(reducers, applyMiddleware(thunk));

// Create selectors in accordance with state
export const userDataSelector = (state: StoreType): UserData => state.userData;
export const errorCodeSelector = (state: StoreType): ErrorType => state.errorCode;