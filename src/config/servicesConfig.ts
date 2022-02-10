import { Category } from "../models/category-type";
import { Order } from "../models/order-type";
import { Product } from "../models/product";
import { UserData } from "../models/user-data";
import AuthServiceFire from "../services/auth/auth-service-fire";
import CategoriesStore from "../services/categories/categories-store";
import ClientStore from "../services/clients/client-store";
import DataProviderFire from "../services/common/data-provider-fire";
import StorageProcessor from "../services/common/storage-processor";
import StorageProviderFire from "../services/common/storage-provider-fire";
import OrderStore from "../services/order/order-store";
import ProductStore from "../services/products/product-store";
import config from "./store-config.json"

export const authService = new AuthServiceFire(config.adminEmail);
export const localPhoneValidationRegex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

//const product service
const productService = new DataProviderFire<Product>('products');
export const productStore = new ProductStore(productService);
//const categories service
const categoriesService = new DataProviderFire<Category>('categories');
export const categoriesStore = new CategoriesStore(categoriesService);
//const order service
const orderProvider = new DataProviderFire<Order>("orders", config.minId, config.maxId);
export const orderStore = new OrderStore(orderProvider);
//const client service
const clientProvider = new DataProviderFire<UserData>("clients");
export const clientStore = new ClientStore(clientProvider);

const productPictureProvider = new StorageProviderFire(config.productPictureFolder);
export const productPictureStore = new StorageProcessor(productPictureProvider);
