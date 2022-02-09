import { Category } from "../models/category-type";
import { Client } from "../models/client-type";
import { Order } from "../models/order-type";
import { Product } from "../models/product";
import AuthServiceFake from "../services/auth/auth-service-fake";
import AuthServiceFire from "../services/auth/auth-service-fire";
import CategoriesStore from "../services/categories/categories-store";
import ClientStore from "../services/clients/client-store";
import DataProviderFire from "../services/common/data-provider-fire";
import OrderStore from "../services/order/order-store";
import ProductStore from "../services/products/product-store";
import config from "./store-config.json"

export const authService = new AuthServiceFire(config.adminEmail);
// export const authService = new AuthServiceFake();

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
const clientProvider = new DataProviderFire<Client>("clients", config.minId, config.maxId);
export const clientStore = new ClientStore(clientProvider);
