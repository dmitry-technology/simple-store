import { UserData } from "../../models/user-data";
import DataProcessor from "../common/data-processor";
import DataProviderFire from "../common/data-provider-fire";

export default class ClientStore extends DataProcessor<UserData> {
    constructor(dataProvider: DataProviderFire<UserData>) {
        super(dataProvider);
    }
}