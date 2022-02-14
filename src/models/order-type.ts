import { emptyProduct, ProductBatch } from "./product";
import { ProductOptionConfigured } from "./product-options";
import { UserData, userDataSimple } from "./user-data";

export enum OrderStatus { WAITING = "waiting", WORKING = "working", COMPLETE = "complete" };

export type Order = {
    id?: string;
    client: UserData;
    products: ProductBatch[];
    status: OrderStatus;
    date: string;
}



export const orderSimple: Order = {
    client: userDataSimple,
    products: [
        {
            id: 'test',
            productConfigured: {
                base: emptyProduct,
                optionsConfigured: [{ optionData: { name: "40", extraPay: 10 }, optionTitle: "Size" }]
            },
            count: 5

        }
    ],
    status: OrderStatus.WAITING,
    date: new Date().toISOString()
}
