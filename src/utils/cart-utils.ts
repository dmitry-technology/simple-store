import { ProductBatch } from "../models/product";

export function getCartItemsCount(batches: ProductBatch[]): number {
    return batches.reduce((sum, batch) => sum += batch.count, 0);
}

export function getCartPrice(batches: ProductBatch[]): number {
    let price = 0;
    for (let batch of batches) {
        price += batch.productConfigured.optionsConfigured.reduce((sum, option) =>
            sum + option.optionData.extraPay, batch.productConfigured.base.basePrice) * batch.count;
    }
    return price;
}

export function getBatchPrice(batchId: string, batches: ProductBatch[]): number {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
        return batch.productConfigured.optionsConfigured.reduce((sum, option) =>
            sum + option.optionData.extraPay, batch.productConfigured.base.basePrice) * batch.count;
    }
    return 0;
}