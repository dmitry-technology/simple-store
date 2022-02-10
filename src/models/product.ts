import { ProductOption, ProductOptionConfigured } from "./product-options";

export type Product = {
    id: string;
    title: string;
    category: number;
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