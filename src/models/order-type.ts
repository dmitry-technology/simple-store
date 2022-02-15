import { emptyProduct, ProductBatch } from "./product";
import { ProductOptionConfigured } from "./product-options";
import { UserData, userDataSimple } from "./user-data";



export type Order = {
    id?: string;
    client: UserData;
    products: ProductBatch[];
    status: string;
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
    status: "waiting",
    date: new Date().toISOString()
}
