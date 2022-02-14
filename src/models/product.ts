import { ProductOption, ProductOptionConfigured } from "./product-options";

export type Product = {
    id: string;
    title: string;
    category: string;
    picture?: string;
    description?: string;
    basePrice: number;
    options?: ProductOption[];
    active: boolean;
}

export type ProductConfigured = {
    base: Product,
    optionsConfigured: ProductOptionConfigured[]
}

export type ProductBatch = {
    id: string;
    productConfigured: ProductConfigured,
    count: number
}

export type UploadProductData = {
    product: Product,
    picture?: File
}

export const emptyProduct: Product ={
    id: '456032',
    title: 'empty title',
    category: '123321',
    basePrice: 50,
    active: true    
}