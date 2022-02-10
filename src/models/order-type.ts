export enum OrderStatus { WAITING="waiting", WORKING="working", COMPLIT="complite" };

export type Order = {
    id?: number;
    userId: string;
    status: OrderStatus;
    products: {productId:number, options: Object, count:number}[] //TODO product:Product, count:number
    totalPrice: number;
    dateCreate: string;
}

