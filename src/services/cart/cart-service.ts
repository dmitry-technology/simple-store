import { ProductBatch } from "../../models/product";
import LocalStorageProvider from "./local-storage-provider";

export default class ShoppingCartService extends LocalStorageProvider<ProductBatch> {
    constructor() {
        super('my-cart');
    }

    getItemsCount(): number {
        let res = 0;
        const batches = this.getAll();
        for (let batch of batches) {
            res += batch.count;
        }
        return res;
    }

    getBatchPrice(batchId: string): number {
        const batch = this.get(batchId);
        if (batch) {
            return batch.productConfigured.optionsConfigured.reduce((sum, option) =>
                sum + option.optionData.extraPay, batch.productConfigured.base.basePrice) * batch.count;
        }
        return 0;
    }

    getCartPrice() {
        const batches = this.getAll();
        let price = 0;
        for (let batch of batches) {
            price += batch.productConfigured.optionsConfigured.reduce((sum, option) =>
                sum + option.optionData.extraPay, batch.productConfigured.base.basePrice) * batch.count;
        }
        return price;
    }
}