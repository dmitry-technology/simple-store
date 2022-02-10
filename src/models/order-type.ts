import { ProductOptionConfigured } from "./product-options";

export enum OrderStatus { WAITING="waiting", WORKING="working", COMPLETE="complete" };

export type Order = {
    id?: string;
    userId: string;
    status?: OrderStatus;
    products?: OrderProduct[];
    totalPrice?: number;
    dateCreate?: string;
}

export type OrderProduct = {
    productId:string, 
    options: ProductOptionConfigured[], 
    count:number
}


export const orderSimple : Order = {
    userId: "ycd8mLBJBUSTp18S15Fi2mlQT1g1",
    status: OrderStatus.COMPLETE,
    products: [{productId:"995511", options: [{optionData: {name: "40", extraPay: 10}, optionTitle:"Size"}], count: 5}],
    totalPrice: 500,
    dateCreate: new Date().toISOString()
}