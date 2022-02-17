import { ProductBatch } from "../../models/product";
import LocalProvider from "./local-provider";

export default class ShoppingCartProcessor {

    constructor(private service: LocalProvider<ProductBatch>) {}

    getShoppingCart(): ProductBatch[] {
        return this.service.getAll();
    }

    addBatchToCart(batch: ProductBatch): void {
        this.service.add(batch);
    }

    removeBatchFromCart(batchId: string): void {
        this.service.remove(batchId);
    }

    clearShoppingCart(): void {
        this.service.removeAll();
    }

    updateBatchInCart(batchId: string, newBatch: ProductBatch): void {
        this.service.update(batchId, newBatch);
    }
}