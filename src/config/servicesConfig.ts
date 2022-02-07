import { Order } from "../models/order-type";
import { Product } from "../models/product";
import AuthServiceFake from "../services/auth/auth-service-fake";
import DataProviderFire from "../services/common/data-provider-fire";
import OrderStore from "../services/order/order-store";
import ProductStore from "../services/products/product-store";
import config from "./store-config.json"

export const authService = new AuthServiceFake();
const productService = new DataProviderFire<Product>('products');
export const productStore = new ProductStore(productService);

//const order service
const orderProvider = new DataProviderFire<Order>("orders", config.minId, config.maxId);
export const orederStore = new OrderStore(orderProvider);