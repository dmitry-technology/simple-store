import { Product } from "../models/product";
import AuthServiceFake from "../services/auth/auth-service-fake";
import DataProviderFire from "../services/common/data-provider-fire";
import ProductStore from "../services/products/product-store";

export const authService = new AuthServiceFake();
const productService = new DataProviderFire<Product>('products');
export const productStore = new ProductStore(productService);