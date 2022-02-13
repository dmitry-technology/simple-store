import { Category } from "../models/category-type";
import { Order } from "../models/order-type";
import { Product } from "../models/product";
import { UserData } from "../models/user-data";
import AuthServiceFire from "../services/auth/auth-service-fire";
import ShoppingCartService from "../services/cart/cart-service";
import CategoriesStore from "../services/categories/categories-store";
import ClientStore from "../services/clients/client-store";
import DataProviderFire from "../services/common/data-provider-fire";
import StorageProcessor from "../services/common/storage-processor";
import StorageProviderFire from "../services/common/storage-provider-fire";
import OrderStore from "../services/order/order-store";
import ProductStore from "../services/products/product-store";
import config from "./store-config.json";

export const authService = new AuthServiceFire(config.clientsCollection, config.adminsCollection);
export const localPhoneValidationRegex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

//const product service
const productService = new DataProviderFire<Product>(config.productsCollection);
export const productStore = new ProductStore(productService);
//const categories service
const categoriesService = new DataProviderFire<Category>(config.categoriesCollection, config.minId, config.maxId);
export const categoriesStore = new CategoriesStore(categoriesService);
//const order service
const orderProvider = new DataProviderFire<Order>(config.ordersCollection, config.minId, config.maxId);
export const orderStore = new OrderStore(orderProvider);
//const client service
const clientProvider = new DataProviderFire<UserData>(config.clientsCollection);
export const clientStore = new ClientStore(clientProvider);

const productPictureProvider = new StorageProviderFire(config.productPictureFolder);
export const productPictureStore = new StorageProcessor(productPictureProvider);

export const shoppingCartService = new ShoppingCartService('my-cart');