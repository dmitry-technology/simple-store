
export enum OrderStatus { WAITING, WORKING, COMPLIT };

export type Order = {
    id?: number;
    userId: number;
    status: OrderStatus;
    products: {productId:number, count:number}[] //TODO product:Product, count:number
    totalPrice: number;
    dateCreate: string;
}
