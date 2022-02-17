import { UserData } from "../models/user-data";
import { PayloadAction } from "@reduxjs/toolkit";
import ErrorType from "../models/error-types";
import { Product, ProductBatch, UploadProductData } from "../models/product";
import { Category } from "../models/category-type";
import { Order } from "../models/order-type";
import { categoriesStore, clientStore, orderStore, productPictureStore, productStore, cartProcessor } from "../config/servicesConfig";
import { NotificationType, UserNotificationMessage } from "../models/user-notification";
import { getProductsFromCSV } from "../utils/product-utils";

export const SET_USER_DATA = "set_user_data";
export const SET_PRODUCTS = "set_products";
export const SET_ERROR_CODE = "set_error_code";
export const SET_CATEGORIES = "set_categories";
export const SET_ORDER_DATA = "set_order_data";
export const SET_CLIENT_DATA = "set_client_data";
export const SET_USER_NOTIFICATION = "set_user_notification";
export const SET_SHOPPING_CART = "set_shopping_cart";

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

export const setShoppingCart: ActionType<ProductBatch[]> = cart => (
    { payload: cart, type: SET_SHOPPING_CART }
)

export const updateProfile = function (userdata: UserData): (dispatch: any) => void {
    return async dispatch => {
        try {
            // Deleting fields that do not need to be saved in the database
            delete userdata.isAdmin;
            delete userdata.isFirstLogin;

            await clientStore.update(userdata.id, userdata);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Profile has been updated', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({ message: 'Error: Can`t update profile.', type: NotificationType.ERROR }));
        }
    }
}

export const addProductAction = function (uploadProductData: UploadProductData): (dispath: any) => void {
    return async dispatch => {
        try {
            const { product, picture } = uploadProductData;
            if (picture) {
                const pictureUrl = await productPictureStore.uploadFile(picture);
                product.picture = pictureUrl;
            }
            await productStore.add(product);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Product has been added', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({ message: 'Error: Can`t add product.', type: NotificationType.ERROR }));
        }
    }
}

export const removeProductAction = function (id: string): (dispath: any) => void {
    return async dispatch => {
        try {
            await productStore.remove(id);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Product has been removed', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err));
            dispatch(setNotificationMessage({ message: 'Error: Can`t remove product.', type: NotificationType.ERROR }));
        }
    }
}

export const updateProductAction = function (uploadProductData: UploadProductData): (dispath: any) => void {
    return async dispatch => {
        const { product, picture } = uploadProductData;
        try {
            if (picture) {
                const pictureUrl = await productPictureStore.uploadFile(picture);
                product.picture = pictureUrl;
            }
            await productStore.update(product.id, product);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Product has been updated', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({ message: 'Error: Can`t update product.', type: NotificationType.ERROR }));
        }
    }
}

export const uploadProductsCsvAction = function (file: File, catId: string): (dispath: any) => void {
    return async dispatch => {
        try {
            const products = await getProductsFromCSV(file);
            for (let i = 0; i < products.length; i++) {
                const prodWithCat = { ...products[i], category: catId };
                const suchProductIsExist = await productStore.exists(products[i].id);
                if (suchProductIsExist) {
                    await productStore.update(products[i].id, prodWithCat);
                } else {
                    await productStore.add(prodWithCat);
                }
            }
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Products successful uploaded from CSV file', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({ message: 'Error: Can`t upload products from CSV file.', type: NotificationType.ERROR }));
        }
    }
}

export const addCategoryAction = function (category: Category): (dispath: any) => void {
    return async dispatch => {
        try {
            await categoriesStore.add(category);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Category has been added', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({ message: 'Error: Can`t add category.', type: NotificationType.ERROR }));
        }
    }
}

export const updateCategoryAction = function (category: Category): (dispath: any) => void {
    return async dispatch => {
        try {
            await categoriesStore.update(category.id, category);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Category has been updated', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({ message: 'Error: Can`t update category.', type: NotificationType.ERROR }));
        }
    }
}

export const removeCategoryAction = function (id: string): (dispath: any) => void {
    return async dispatch => {
        try {
            const productsByCat = (await productStore.fetch()).filter(p => p.category === id);
            if (productsByCat.length > 0) {
                for (let i = 0; i < productsByCat.length; i++) {
                    await productStore.remove(productsByCat[i].id);
                }
            }
            await categoriesStore.remove(id);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Category has been removed', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({ message: 'Error: Can`t remove category.', type: NotificationType.ERROR }));
        }
    }
}

export const addOrderAction = function (orderData: Order): (dispath: any) => void {
    return async dispath => {
        try {
            await orderStore.add(orderData);
            dispath(setErrorCode(ErrorType.NO_ERROR));
        } catch (err: any) {
            dispath(setErrorCode(err))
        }
    }
}
export const updateOrderAction = function (id: string, order: Order): (dispatch: any) => void {
    return async dispatch => {
        try {
            await orderStore.update(id, order);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Order has been updated', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err))
            dispatch(setNotificationMessage({ message: 'Error: Can`t update order.', type: NotificationType.ERROR }));
        }
    }
}

export const removeOrderAction = function (id: string): (dispath: any) => void {
    return async dispatch => {
        try {
            await orderStore.remove(id);
            dispatch(setErrorCode(ErrorType.NO_ERROR));
            dispatch(setNotificationMessage({ message: 'Order has been removed', type: NotificationType.SUCCESS }));
        } catch (err: any) {
            dispatch(setErrorCode(err));
            dispatch(setNotificationMessage({ message: 'Error: Can`t remove product.', type: NotificationType.ERROR }));
        }
    }
}

export const addBatchToCartAction = function (batch: ProductBatch): (dispath: any) => void {
    return dispath => {
        cartProcessor.addBatchToCart(batch);
        dispath(setShoppingCart(cartProcessor.getShoppingCart()));
    }
}

export const removeBatchFromCartAction = function (batchId: string): (dispath: any) => void {
    return dispath => {
        cartProcessor.removeBatchFromCart(batchId);
        dispath(setShoppingCart(cartProcessor.getShoppingCart()));
    }
}

export const clearShoppingCartAction = function (): (dispath: any) => void {
    return dispath => {
        cartProcessor.clearShoppingCart();
        dispath(setShoppingCart(cartProcessor.getShoppingCart()));
    }
}

export const updateBatchInCartAction = function (batchId: string, newBatch: ProductBatch): (dispath: any) => void {
    return dispath => {
        cartProcessor.updateBatchInCart(batchId, newBatch);
        dispath(setShoppingCart(cartProcessor.getShoppingCart()));
    }
}