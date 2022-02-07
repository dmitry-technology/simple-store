import { Order } from "../models/order-type";
import AuthServiceFake from "../services/auth/auth-service-fake";
import DataProviderFire from "../services/common/data-provider-fire";
import OrderStore from "../services/order/order-store";
import config from "./store-config.json"

export const authService = new AuthServiceFake();

//const order service
const orderProvider = new DataProviderFire<Order>("orders", config.minId, config.maxId);
export const orederStore = new OrderStore(orderProvider);