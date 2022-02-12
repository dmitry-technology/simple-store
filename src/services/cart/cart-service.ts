import { ProductBatch } from "../../models/product";
import LocalStorageProvider from "./local-storage-provider";

export default class ShoppingCartService extends LocalStorageProvider<ProductBatch> {
    constructor(storageName: string) {
        super(storageName);
    }
}