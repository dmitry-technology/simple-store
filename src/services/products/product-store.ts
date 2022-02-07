import { Product } from "../../models/product";
import DataProcessor from "../common/data-processor";
import DataProviderFire from "../common/data-provider-fire";

export default class ProductStore extends DataProcessor<Product> {
    constructor(dataProvider: DataProviderFire<Product>) {
        super(dataProvider);
    }
}