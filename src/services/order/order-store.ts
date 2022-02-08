import { Observable } from "rxjs";
import { Order } from "../../models/order-type";
import DataProcessor from "../common/data-processor";
import DataProvider from "../common/data-provider";

export default class OrderStore extends DataProcessor<Order> {
    constructor(dataProvider: DataProvider<Order>) {
        super(dataProvider)
    }

}