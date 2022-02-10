import { ProductOptionConfigured } from "./product-options";

export enum OrderStatus { WAITING="waiting", WORKING="working", COMPLIT="complite" };

export type Order = {
    id?: number;
    userId: string;
    status: OrderStatus;
    products: OrderProduct[],
    totalPrice: number;
    dateCreate: string;
}

export type OrderProduct = {
    productId:number, 
    options: ProductOptionConfigured[], 
    count:number
}

