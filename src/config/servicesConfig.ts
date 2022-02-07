import { Category } from "../models/category-type";
import { Product } from "../models/product";
import AuthServiceFake from "../services/auth/auth-service-fake";
import CategoriesStore from "../services/categories/categories-store";
import DataProviderFire from "../services/common/data-provider-fire";
import ProductStore from "../services/products/product-store";

export const authService = new AuthServiceFake();

const productService = new DataProviderFire<Product>('products');
export const productStore = new ProductStore(productService);

const categoriesService = new DataProviderFire<Category>('categories');
export const categoriesStore = new CategoriesStore(categoriesService);