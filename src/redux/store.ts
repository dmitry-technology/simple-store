import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { Category } from "../models/category-type";
import ErrorType from "../models/error-types";
import { Product } from "../models/product";
import { UserData } from "../models/user-data";
import { categoriesReducer, errorCodeReducer, productsReducer, userDataReducer } from "./reducers";

type StoreType = {
    userData: UserData,
    errorCode: ErrorType,
    products: Product[],
    categories: Category[]
};

const reducers = combineReducers<StoreType>({
    userData: userDataReducer,
    errorCode: errorCodeReducer,
    products: productsReducer,
    categories: categoriesReducer
});

// Create store
export const store = createStore(reducers, applyMiddleware(thunk));

// Create selectors in accordance with state
export const userDataSelector = (state: StoreType): UserData => state.userData;
export const errorCodeSelector = (state: StoreType): ErrorType => state.errorCode;
export const productsSelector = (state: StoreType): Product[] => state.products;
export const categoriesSelector = (state: StoreType): Category[] => state.categories;