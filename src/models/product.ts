export type Product = {
    id: number;
    title: string;
    category: number;
    picture?: string;
    description?: string;
    basePrice: number;
    options?: Object;
    active: boolean;
}