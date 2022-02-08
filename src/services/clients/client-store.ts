import { Client } from "../../models/client-type";
import DataProcessor from "../common/data-processor";
import DataProviderFire from "../common/data-provider-fire";

export default class ClientStore extends DataProcessor<Client> {
    constructor(dataProvider: DataProviderFire<Client>) {
        super(dataProvider);
    }
}