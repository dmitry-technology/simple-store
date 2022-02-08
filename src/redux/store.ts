import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { Client } from "../models/client-type";
import ErrorType from "../models/error-types";
import { Order } from "../models/order-type";
import { UserData } from "../models/user-data";
import { errorCodeReducer, userDataReducer, ordersReducer, clientsReducer } from "./reducers";

type StoreType = {
    userData: UserData,
    orders: Order[],
    clients: Client[],
    errorCode: ErrorType
};

const reducers = combineReducers<StoreType>({
    userData: userDataReducer,
    orders: ordersReducer,
    clients: clientsReducer,
    errorCode: errorCodeReducer
});

// Create store
export const store = createStore(reducers, applyMiddleware(thunk));

// Create selectors in accordance with state
export const userDataSelector = (state: StoreType): UserData => state.userData;
export const errorCodeSelector = (state: StoreType): ErrorType => state.errorCode;
export const ordersSelector = (state: StoreType): Order[] => state.orders;
export const clientSelector = (state: StoreType): Client[] => state.clients;