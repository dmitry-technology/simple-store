import { Category } from "../../models/category-type";
import DataProcessor from "../common/data-processor";
import DataProviderFire from "../common/data-provider-fire";

export default class CategoriesStore extends DataProcessor<Category> {
    constructor(dataProvider: DataProviderFire<Category>) {
        super(dataProvider);
    }
}