import { ProductOptionConfigured } from "./product-options";

export enum OrderStatus { WAITING="waiting", WORKING="working", COMPLETE="complete" };

export type Order = {
    id?: string;
    client: string;
    address: string;
    phone: string;
    products: OrderProduct[];
    status: OrderStatus;
    date: string;
    price: number;
}

export type OrderProduct = {
    productName: string, 
    options: ProductOptionConfigured[], 
    count:number
}


export const orderSimple : Order = {
    client: "Jof Bezz",
    address: "street: wolter, house: 1, flat: 1, floor: 1",
    phone: "8-800-800-80-80",
    products: [{productName:"Margarita", options: [{optionData: {name: "40", extraPay: 10}, optionTitle:"Size"}], count: 5}],
    status: OrderStatus.WAITING,
    date: new Date().toISOString(),
    price: 500
}